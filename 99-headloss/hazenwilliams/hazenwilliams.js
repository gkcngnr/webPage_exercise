const form = document.getElementById("form");
const flowrate = document.getElementById("flowrate");
const diameter = document.getElementById("diameter");
const flowUnit = document.getElementById("flowUnit");
const pipeTypes = document.querySelectorAll('input[name="pipetype"]');
const pressures = document.getElementById("pressure");
const lining = document.getElementById("lining");
const pipeLength = document.getElementById("pipeLength");
const results = document.querySelector(".result");
const localHead = document.getElementById("localHead");
const thickness = document.getElementById("thickness");
const inner = document.getElementById("innerDiameter");
const diameterRow = document.getElementById("diameterRow")
const diameterRowFree = document.getElementById("diameterRowFree")
const diameterfree = document.getElementById("diameterfree")
const coefficient = document.getElementById("coefficient")
const submitButton = document.querySelector('button[type="submit"]');


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
            pressurePE()
            
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});    

//STEEL JSON dosyasndan çekiliyor.
fetch('../data/STEEL.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();// JSON verisini döndür
        })
        .then(data => {
            steelData = data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

//DUCTILE JSON dosyasından çekiliyor
fetch('../data/DUCTILE.json')
        .then(response => {
            if(!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then (data => {
            ductileData = data;
        })
        .catch(error => {
            console.log('There has been a problem with your fetch operation:', error);
        });

//inputları temizleme
function clearInput() {
    flowrate.value=""
    diameter.value=""
    diameterfree.value=""
    pipeLength.value=""
    diameter.innerHTML=""
    lining.value=""
    localHead.value=""
    pressures.innerHTML=""
    inner.value=""
    thickness.value=""
    coefficient.value=""
    submitButton.disabled = false;
    
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
    if (selectedType.id === "pe100") {
        pressurePE()

    } else if (selectedType.id === "steel") {
        diameterSt()
        
    } else if (selectedType.id === "ductile"){
        pressureDc()
        innerDiameterShow()
    } else if(selectedType.id === "free"){
        freeCalc()
    }
}

// basınca gore PE çap getirme
function pressurePE() {
    Object.keys(pe100Data).forEach(key => {
        if (key === "PN10") {
            pressures.innerHTML += `<option value="${key}" selected>${key}</option>`
        } else {
            pressures.innerHTML += `<option value="${key}">${key}</option>`
        }
    })
    
    diameterPE()
}
    

function diameterPE() {
    selectedPipeType = "PE100"
    pressure.removeEventListener("change", diameterDC)
    pressure.addEventListener("change", diameterPE)     //pressure buttonlarına change eventi eklendi
    diameter.removeEventListener("change", thicknessSt)
    lining.parentElement.parentElement.classList.add("hide");
    thickness.parentElement.parentElement.classList.add("hide");
    inner.parentElement.parentElement.classList.add("hide");
    diameterRowFree.classList.add("hide");
    diameterfree.required = false;
    diameterRow.classList.remove("hide");
    coefficient.parentElement.parentElement.classList.add("hide");
    lining.required = false;
    diameter.innerHTML = ""     
    pe100Data[pressures.value].forEach(option => {
        diameter.innerHTML += `<option>${option.diameter}</option>`
    })
    }
    

//Çelik çapa göre et kalınlığı seçenekleri
function thicknessSt() {
    pressures.innerHTML = ""
    for (let i=0; i<steelData[diameter.value][0].thickness.length; i++) {
        
        pressures.innerHTML += `<option>e=${steelData[diameter.value][0].thickness[i]}</option>`
    }
}


//Çelik çap seçenekleri
function diameterSt() {
    selectedPipeType = "St,"
    pressure.removeEventListener("change", diameterPE)
    diameter.addEventListener("change", thicknessSt)
    lining.disabled = false;
    lining.required = true;
    lining.parentElement.parentElement.classList.remove("hide");
    thickness.parentElement.parentElement.classList.add("hide");
    inner.parentElement.parentElement.classList.remove("hide");
    diameterRowFree.classList.add("hide");
    diameterfree.required = false;
    diameterRow.classList.remove("hide");
    coefficient.parentElement.parentElement.classList.add("hide");
    Object.keys(steelData).forEach(key => {
        diameter.innerHTML += `<option>${key}</option>`
        
    })
    thicknessSt()
}

// basınca gore Ductile çap getirme
function pressureDc() {
    Object.keys(ductileData).forEach(key => {
        if (key === "C40") {
            pressures.innerHTML += `<option value="${key}" selected>${key}</option>`
        } else {
            pressures.innerHTML += `<option value="${key}">${key}</option>`
        }
    })
    
    diameterDC()
}

// Ductile çap getirme
function diameterDC() {
    selectedPipeType = "Ductile"
    pressure.removeEventListener("change", diameterPE)
    pressure.addEventListener("change", diameterDC)     //pressure buttonlarına change eventi eklendi
    diameter.removeEventListener("change", thicknessSt)
    diameter.addEventListener("change", liningDc)
    lining.parentElement.parentElement.classList.remove("hide");
    thickness.parentElement.parentElement.classList.add("hide");
    inner.parentElement.parentElement.classList.remove("hide");
    diameterRowFree.classList.add("hide");
    diameterfree.required = false;
    diameterRow.classList.remove("hide");
    coefficient.parentElement.parentElement.classList.add("hide");
    lining.disabled = true;
    diameter.innerHTML = "";
    ductileData[pressures.value].forEach(option => {
        
        diameter.innerHTML += `<option>${option.diameter}</option>`
    })
    lining.value = ductileData[pressures.value].find(item => item.diameter == diameter.value).lining;
    }
// default lining Ductile
function liningDc() {
    lining.value = ductileData[pressures.value].find(item => item.diameter == diameter.value).lining;
}

// Free Calculation
function freeCalc() {
    selectedPipeType = ""
    lining.parentElement.parentElement.classList.remove("hide");
    thickness.parentElement.parentElement.classList.remove("hide");
    inner.parentElement.parentElement.classList.remove("hide");
    diameterRowFree.classList.remove("hide");
    diameterfree.required = true;
    diameterRow.classList.add("hide");
    coefficient.parentElement.parentElement.classList.remove("hide");
    lining.disabled = false;
    lining.required = true;
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
                innerDiameter = pe100Data[pressures.value].find(item => item.diameter == diameter.value).inner;
                C = HazenWilliamsC.pe100
            } else if (selectedPipe === "steel") {
                thicknessValue1 = parseFloat((pressures.value).slice(2))
                thicknessValue2 = parseFloat(lining.value)
                innerDiameter = (steelData[diameter.value][0].outerDiameter - 2*(thicknessValue1 + thicknessValue2)).toFixed(2);
                C = HazenWilliamsC.steel
            } else if (selectedPipe === "ductile") {
                outerDiameter = ductileData[pressures.value].find(item => item.diameter == diameter.value).outer;
                thicknessValue1 = ductileData[pressures.value].find(item => item.diameter == diameter.value).thickness;
                thicknessValue2 = parseFloat(lining.value);
                innerDiameter = outerDiameter - 2*(thicknessValue1+thicknessValue2);
                C = HazenWilliamsC.ductile;
            } else if (selectedPipe === "free") {
                outerDiameter = parseFloat(diameterfree.value);
                thicknessValue1 = parseFloat(thickness.value);
                thicknessValue2 = parseFloat(lining.value);
                innerDiameter = outerDiameter - 2*(thicknessValue1+thicknessValue2);
                C = coefficient.value; 
            }
        if (innerDiameter < 0) {
            submitButton.disabled = true;
            
        } else {
            submitButton.disabled = false;
            return innerDiameter, C
        }
}

// inner diameter otomatik hesap
diameter.addEventListener("change", innerDiameterShow)
diameterfree.addEventListener("keyup", innerDiameterShow)
lining.addEventListener("keyup", innerDiameterShow)
thickness.addEventListener("keyup", innerDiameterShow)
function innerDiameterShow() {
    if (selectedPipeType === "") {
        if (!isNaN(parseFloat(lining.value)) && !isNaN(parseFloat(diameterfree.value)) && !isNaN(parseFloat(thickness.value))) {
            innerDiameterCalculation()
            inner.value = innerDiameter
        } else {
            inner.value =""
        }
    } else if (selectedPipeType === "Ductile"){
        innerDiameterCalculation()
        inner.value = innerDiameter
    } else if (selectedPipeType === "St,") {
        if (!isNaN(parseFloat(lining.value))) {
            innerDiameterCalculation()
            inner.value = innerDiameter
        } else {
            inner.value =""
        }
    }

    innerDiameterColor()
    
    
}
function innerDiameterColor() {
    if (parseFloat(innerDiameter) < 0) {
        inner.classList.add("danger");
    } else {
        inner.classList.remove("danger");
    }
}


// A - J - JL Hesaplama
let area;
let velocity;
let headloss;
let localHeadloss;
let totalHeadloss;
let total;

function headlossCalculation() {
    unitConversion()
    innerDiameterCalculation()
    area = ((innerDiameter/1000)**2 * Math.PI /4);
    velocity = (calculatedFlowrate / area).toFixed(2);
    //headloss = ((10.7 * (calculatedFlowrate/C)**1.852 ) / (innerDiameter/1000)**4.87).toFixed(6)
    headloss = ((10.583 * (calculatedFlowrate)**1.85 ) / (C**1.85 * (innerDiameter/1000)**4.87)).toFixed(6)
    totalHeadloss = (headloss * pipeLength.value).toFixed(2);
    if (localHead.value>0) {
        localHeadloss = (totalHeadloss * (localHead.value)/100).toFixed(2);
    } else {
        localHeadloss = 0;
    }
    total = (parseFloat(totalHeadloss) + parseFloat(localHeadloss)).toFixed(2);
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
                    <div class="col-2"> Q </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${parseFloat(flowrate.value).toFixed(2)} ${showedFlowUnit} </div>  
                </div>
                <div class="row">
                    <div class="col-2"> D </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> Ø${diameter.value}${diameterfree.value}mm ${selectedPipeType} ${pressure.value} </div>  
                </div>
                <div class="row">
                    <div class="col-2"> V </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${velocity} m/s </div>  
                </div>
                <div class="row">
                    <div class="col-2"> J </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${headloss} m/m (C:${C})</div>  
                </div>
                    <div class="row">
                    <div class="col-2"> JL </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${totalHeadloss} m </div>  
                </div>
                <div class="row">
                    <div class="col-2"> % </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${localHeadloss} m (JL x ${localHead.value}%) </div>  
                </div>
                <div class="row">
                    <div class="col-2"> JLt </div>
                    <div class="col-1"> = </div>    
                    <div class="col-8"> ${total} m </div>  
                </div>
            </div>
    </div>`
}


form.addEventListener("submit", e => {
    e.preventDefault();
    headlossCalculation()
    resultsContainer()

})


