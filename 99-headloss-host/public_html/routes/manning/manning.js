const pipeTypes = document.querySelectorAll('input[name="pipetype"]');
const flowrate = document.getElementById("flowrate");
const flowUnit = document.getElementById("flowUnit");
const diameter = document.getElementById("diameter");
const coefficient = document.getElementById("coefficient");
const slope = document.getElementById("slope");
const results = document.querySelector(".result");


document.addEventListener('DOMContentLoaded', () => {
    pipeTypes.forEach(pipeType => {
        if (pipeType.checked) {
            pipeTypeSelection({ target: pipeType });
        }
    })
})

const manningN = {
    "concrete" : 0.014,
    "HDPE" : 0.009
}


//inputları temizleme
function clearInput() {
    flowrate.value="";
    diameter.value="";
    slope.value="";

}

//pipe type radio buttonlarına change eventi eklendi
for (const pipeType of pipeTypes ) {
    pipeType.addEventListener("change", pipeTypeSelection)
}


//Seçili boru tipi radio buttonununn yapacakları fonksiyonu
let selectedPipeType;
function pipeTypeSelection(event) {
    clearInput()
    const selectedType = event.target;
    if (selectedType.id === "concrete") {
        selectedPipeType = "Concrete"
        coefficient.value = manningN.concrete.toFixed(3);
        
    } else if (selectedType.id === "HDPE") {
        coefficient.value = manningN.HDPE.toFixed(3);
        selectedPipeType = "HDPE"
    } 
}


// debi değeri birim değiştirme
flowUnit.addEventListener("change", unitConversion);

let showedFlowUnit = ""
let calculatedFlowrate = flowrate.value;

function unitConversion()  {
    calculatedFlowrate = flowrate.value;
    if (flowUnit.value === "m3s") {
        showedFlowUnit = "m³/s"
        calculatedFlowrate = (calculatedFlowrate*1000).toFixed(3);
    } else if (flowUnit.value === "m3h") {
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

// doluluk değerleri indeks/100 olacak şekilde K arrayi
const manningTable = [0, 0.000047, 0.00021, 0.0005, 0.00093, 0.0015, 0.00221, 0.00306, 0.00407, 0.00521,
                      0.00651, 0.00795, 0.00953, 0.0113, 0.0131, 0.0152, 0.0173, 0.0196, 0.0220, 0.0246,
                      0.0273, 0.0301, 0.0331, 0.0362, 0.0394, 0.0427, 0.0461, 0.0497, 0.0534, 0.0572,
                      0.0610, 0.065, 0.0691, 0.0733, 0.0776, 0.082, 0.0864, 0.0910, 0.0956, 0.1003,
                      0.105, 0.1099, 0.1148, 0.1197, 0.1248, 0.1298, 0.1349, 0.1401, 0.1453, 0.1506,
                      0.156, 0.161, 0.166, 0.172, 0.177, 0.183, 0.188, 0.193, 0.199, 0.204,
                      0.209, 0.215, 0.22, 0.225, 0.231, 0.236, 0.241, 0.246, 0.251, 0.256,
                      0.261, 0.266, 0.271, 0.275, 0.280, 0.284, 0.289, 0.293, 0.297, 0.301,
                      0.305, 0.308, 0.312, 0.315, 0.318, 0.321, 0.324, 0.326, 0.329, 0.331,
                      0.332, 0.334, 0.335, 0.335, 0.335, 0.335, 0.334, 0.332, 0.329, 0.325,
                      0.312
                    ]

function velocityCalc(fullness, pipeDN) {
    const wettedPerimeterAngle = Math.acos(1 - 2*fullness/100)*360/Math.PI;
    const wettedArea = (pipeDN/1000)**2 / 4*(Math.PI*wettedPerimeterAngle/360-0.5*Math.sin(wettedPerimeterAngle*Math.PI/180));
    velocity = calculatedFlowrate/1000 / wettedArea;
}                    

function fullnessCalc() {
    unitConversion()
    const epsilon = 0.00015;

    const pipeDN = parseInt(diameter.value);
    const pipeSlope = 1/slope.value;
    const manningCoef = parseFloat(coefficient.value);

    const calculatedK =  ( calculatedFlowrate/1000 * manningCoef ) / ((pipeDN/1000) ** (8/3) * (pipeSlope ** 0.5))
    console.log(calculatedK)
    for (let i=0; i<manningTable.length; i++) {
        const diff = Math.abs(calculatedK - manningTable[i]);
        
        if (diff < epsilon) {
            console.log(diff)
            fullness = i;
            waterLvl = i*pipeDN/100;
            velocityCalc(fullness, pipeDN);
            resultsContainer()
            break;

        } else if (calculatedK > manningTable[i] && calculatedK < manningTable[i+1]) {
            const dif = manningTable[i+1] - manningTable[i];
            const requested = calculatedK - manningTable[i];
            const enterpolation = (requested / dif);
            fullness =  i + enterpolation;
            waterLvl = i*pipeDN/100;

            velocityCalc(fullness, pipeDN)
            resultsContainer()
            break;

        } else if (calculatedK < manningTable[i] && calculatedK > manningTable[i+1]) {
            const dif = manningTable[i] - manningTable[i+1];
            const requested = calculatedK - manningTable[i+1];
            const enterpolation = (requested / dif);
            fullness =  i+1 + enterpolation;
            waterLvl = i*pipeDN/100;

            velocityCalc(fullness, pipeDN)
            resultsContainer()
            break;
        } else if (i == manningTable.length -1){
            alert("This diameter is insufficient for this flow rate!");
            break;
        }
    }

}

//sonuçları yazdırma
let resultCount = 0;
function resultsContainer() {
    resultCount++
    if (results.children.length >= 3) {
        results.removeChild(results.firstElementChild);
        
    }
    document.querySelector(".result").innerHTML += `
            

        <div class="card" style="width: 18rem;">
            <h4 class="card-title">Result-${resultCount}</h4>
            <hr class="m-1">
            <div class="card-body">
                <div class="row">
                    <div class="col-3"> Q </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> ${parseFloat(flowrate.value).toFixed(2)} ${showedFlowUnit} </div>  
                </div>
                <div class="row">
                    <div class="col-3"> D </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> Ø${diameter.value}mm ${selectedPipeType} </div>  
                </div>
                <div class="row">
                    <div class="col-3"> V </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> ${velocity.toFixed(2)} m/s </div>  
                </div>
                <div class="row">
                    <div class="col-3"> S </div>
                    <div class="col-1"> = </div>    
                    <div class="col-7"> 1/${slope.value} m/m </div>  
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


