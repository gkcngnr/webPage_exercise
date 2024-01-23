const kpipeTypes = document.querySelectorAll('input[name="pipetype"]');
const Kflowrate = document.getElementById("flowrate");
const KflowUnit = document.getElementById("flowUnit");
const Kdiameter = document.getElementById("diameter");
const Kcoefficient = document.getElementById("coefficient");
const Kslope = document.getElementById("slope");
const Kresults = document.querySelector(".result");


document.addEventListener('DOMContentLoaded', () => {
    kpipeTypes.forEach(pipeType => {
        if (pipeType.checked) {
            pipeTypeSelection({ target: pipeType });
        }
    })
})

const kutterM = {
    "concrete" : 0.200,
    "HDPE" : 0.110
}


//inputları temizleme
function clearInput() {
    Kflowrate.value="";
    Kdiameter.value="";
    Kslope.value="";

}

//pipe type radio buttonlarına change eventi eklendi
for (const pipeType of kpipeTypes ) {
    pipeType.addEventListener("change", pipeTypeSelection)
}


//Seçili boru tipi radio buttonununn yapacakları fonksiyonu
let selectedPipeType;
function pipeTypeSelection(event) {
    clearInput()
    const selectedType = event.target;
    if (selectedType.id === "concrete") {
        selectedPipeType = "Concrete"
        Kcoefficient.value = kutterM.concrete.toFixed(3);
        
    } else if (selectedType.id === "HDPE") {
        Kcoefficient.value = kutterM.HDPE.toFixed(3);
        selectedPipeType = "HDPE"
    } 
}


// debi değeri birim değiştirme
KflowUnit.addEventListener("change", unitConversion);

let showedFlowUnit = ""
let calculatedFlowrate = Kflowrate.value;

function unitConversion()  {
    calculatedFlowrate = Kflowrate.value;
    if (KflowUnit.value === "m3s") {
        showedFlowUnit = "m³/s"
        calculatedFlowrate = (calculatedFlowrate*1000).toFixed(3);
    } else if (KflowUnit.value === "m3h") {
        calculatedFlowrate = (calculatedFlowrate/3.6).toFixed(3);
        showedFlowUnit = "m³/h"
    } else {
        showedFlowUnit = "lt/s"
    }
    return { showedFlowUnit, calculatedFlowrate };
}

let velocity ="";
let fullness="";
let waterLvl="";

function fullnessCalc() {
    unitConversion()
    const pipeDN = parseInt(Kdiameter.value);
    const pipeSlope = Kslope.value;
    const kutterCoef = parseFloat(Kcoefficient.value);
    const tolerance = 0.1
    let iterationResults = {}

    for(let i=0.01; i<=pipeDN; i += 0.01) {
        fullness = i / pipeDN * 100;
        const wettedPerimeterAngle = Math.acos(1 - 2*fullness/100)*360/Math.PI;
        const wettedArea = (pipeDN/1000)**2 / 4*(Math.PI*wettedPerimeterAngle/360-0.5*Math.sin(wettedPerimeterAngle*Math.PI/180));
        const wettedPerimeter = Math.PI*pipeDN/1000*wettedPerimeterAngle/360;
        const hydraulicRadius = wettedArea / wettedPerimeter;
        velocity = 100*Math.sqrt(hydraulicRadius)*Math.sqrt(1/pipeSlope*hydraulicRadius)/(kutterCoef+Math.sqrt(hydraulicRadius));
        const iteratedFlowrate = (wettedArea * velocity * 1000).toFixed(3);
        const difference = Math.abs(parseFloat(iteratedFlowrate) - parseFloat(calculatedFlowrate));
        if (difference < tolerance) {
            iterationResults[difference.toFixed(5)] = {
                "waterLvl" : i,
                "velocity" : velocity,
                "fullness" : fullness
            };
        }
    }
    
    if (Object.keys(iterationResults).length === 0) {
        alert("This diameter is insufficient for this flow rate!")
    } else {
        let keys = Object.keys(iterationResults);
        keys.sort((a,b) => parseFloat(a) - parseFloat(b));

        console.log(iterationResults)
        const minResult = iterationResults[keys[0]]

        velocity = minResult.velocity;
        fullness = minResult.fullness;
        waterLvl = minResult.waterLvl;
        resultsContainer()
    }
}

//sonuçları yazdırma
let resultCount = 0;
function resultsContainer() {
    let resultContCount;
    if (window.innerWidth < 700) {
        resultContCount = 2
    } else {
        resultContCount = 3
    }
    resultCount++
    if (Kresults.children.length >= resultContCount) {
        Kresults.removeChild(Kresults.firstElementChild);
        
    }
    document.querySelector(".result").innerHTML += `
            

        <div class="card" style="width: 18rem;">
            <h4 class="card-title">Result-${resultCount}</h4>
            <hr class="m-1">
            <div class="card-body">
                <div class="row">
                    <div class="col-3"> Q </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> ${parseFloat(Kflowrate.value).toFixed(2)} ${showedFlowUnit} </div>  
                </div>
                <div class="row">
                    <div class="col-3"> D </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> Ø${Kdiameter.value}mm ${selectedPipeType} </div>  
                </div>
                <div class="row">
                    <div class="col-3"> V </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> ${velocity.toFixed(2)} m/s </div>  
                </div>
                <div class="row">
                    <div class="col-3"> S </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> 1/${Kslope.value} m/m </div>  
                </div>
                <div class="row">
                    <div class="col-3"> h </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> ${(waterLvl/10).toFixed(2)} cm </div>  
                </div>
                <div class="row">
                    <div class="col-3"> h/H </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> ${fullness.toFixed(2)} % </div>  
                </div>
            </div>
    </div>`
}


form.addEventListener("submit", e => {
    e.preventDefault();
    fullnessCalc()

})


