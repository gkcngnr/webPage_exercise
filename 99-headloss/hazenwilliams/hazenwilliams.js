const form = document.getElementById("form");
const flowrate = document.getElementById("flowrate");
const diameter = document.getElementById("diameter");
const flowUnit = document.getElementById("flowUnit");
const pipeTypes = document.querySelectorAll('input[name="pipetype"]');
const pressures = document.getElementById("pressure");
const lining = document.getElementById("lining");
const pipeLength = document.getElementById("pipeLength");
const results = document.querySelector(".result");



const HazenWilliamsC = {
    "pe100" : 149,
    "steel" : 110,
    "ductile":130
}

//PE100 JSON dosyasından çekiliyor.
// açılışta json yükleme ve PE100  çapları getirme
document.addEventListener('DOMContentLoaded', () => {
    fetch('../data/PE100.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();// JSON verisini döndür
        })
        .then(data => {
            pe100Data = data;
            diameterPE(); // Burada diameterPE() çağrılabilir.
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});    

//inputları temizleme
function clearInput() {
    flowrate.value=""
    diameter.value=""
    lining.value=""
    pipeLength.value=""
    diameter.innerHTML=""
    lining.value=""
    
}

//pipe type radio buttonlarına change eventi eklendi
for (const pipeType of pipeTypes ) {
    pipeType.addEventListener("change", pipeTypeSelection)
}


//pressure buttonlarına change eventi eklendi
pressure.addEventListener("change", diameterPE);


//Seçili boru tipi radio buttonununn yapacakları fonksiyonu
function pipeTypeSelection(event) {
    
    const selectedType = event.target;
    if (selectedType.id === "pe100") {
        clearInput()
        pressures.classList.add("show");
        lining.parentElement.parentElement.classList.add("hide");
        diameterPE()
        

    } else if (selectedType.id === "steel") {
        clearInput()
        pressures.classList.remove("show");
        pressures.classList.add("hide");
        lining.parentElement.parentElement.classList.remove("hide")
        lining.required = true;
    }
}

// basınca gore PE çap getirme
function diameterPE() {
    lining.required = false;
    diameter.innerHTML = ""
    pe100Data[pressures.value].forEach(option => {
        diameter.innerHTML += `<option>${option.diameter}</option>`
    })
}


// debi değeri birim değiştirme
flowUnit.addEventListener("change", unitConversion);

let showedFlowUnit = ""
let calculatedFlowrate = flowrate.value;

function unitConversion()  {
    calculatedFlowrate = flowrate.value;
    if (flowUnit.value === "lts") {
        showedFlowUnit = "lt/sn"
        calculatedFlowrate = (calculatedFlowrate/1000).toFixed(5);
    } else if (flowUnit.value === "m3h") {
        calculatedFlowrate = (calculatedFlowrate/3600).toFixed(5);
        showedFlowUnit = "m³/h"
    } else {
        showedFlowUnit = "m³/s"
    }
    return { showedFlowUnit, calculatedFlowrate };
}

//iç çap hesabı
let innerDiameter;
function innerDiameterCalculation() {
    for (const pipeType of pipeTypes) {
        if (pipeType.checked) {
            selectedPipe = pipeType.id}
        }
    if (selectedPipe === "pe100") {
        console.log(HazenWilliamsC.pe100)
        innerDiameter = pe100Data[pressures.value].find(item => item.diameter == diameter.value).inner;
        C = HazenWilliamsC.pe100
    }
    return innerDiameter, C
}

// A - J - JL Hesaplama
let area;
let velocity;
let headloss;
let totalHeadloss;
function headlossCalculation() {
    unitConversion()
    innerDiameterCalculation()
    area = ((innerDiameter/1000)**2 * Math.PI /4);
    velocity = (calculatedFlowrate / area).toFixed(2);
    headloss = ((10.7 * (calculatedFlowrate/C)**1.852 ) / (innerDiameter/1000)**4.87).toFixed(6)
    headloss2 = ((10.583 * (calculatedFlowrate)**1.85 ) / (C**1.85 * (innerDiameter/1000)**4.87)).toFixed(6)
    totalHeadloss = (headloss * pipeLength.value).toFixed(2)
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
            <hr>
            <div class="card-body">
                <div class="row">
                    <div class="col-2"> Q </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${parseFloat(flowrate.value).toFixed(2)} ${showedFlowUnit} </div>  
                </div>
                <div class="row">
                    <div class="col-2"> D </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> Ø${diameter.value}PE100 ${pressure.value} </div>  
                </div>
                <div class="row">
                    <div class="col-2"> V </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${velocity} m/s </div>  
                </div>
                <div class="row">
                    <div class="col-2"> J </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${headloss} m/m </div>  
                </div>
                <div class="row">
                    <div class="col-2"> JL </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${totalHeadloss} m </div>  
                </div>
            </div>
    </div>`
}


form.addEventListener("submit", e => {
    e.preventDefault();
    headlossCalculation()
    resultsContainer()
})


