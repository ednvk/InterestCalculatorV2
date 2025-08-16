/* eslint-env browser, es6 */
/* jshint esversion: 6 */
/* global document, alert */

let SimComEl = document.getElementById("SimCom");
let amountInputEl = document.getElementById("amountInput");
let rateInputEl = document.getElementById("rateInput");

let dayGivenInputValueEl = document.getElementById("dayGivenInputValue");
let monthGivenInputValueEl = document.getElementById("monthGivenInputValue");
let yearGivenInputValueEl = document.getElementById("yearGivenInputValue");

let dayRetInputValueEl = document.getElementById("dayRetInputValue");
let monthRetInputValueEl = document.getElementById("monthRetInputValue");
let yearRetInputValueEl = document.getElementById("yearRetInputValue");

let backYearEl = document.getElementById("backYear");
let backMonthEl = document.getElementById("backMonth");
let backDayEl = document.getElementById("backDay");

let interestEl = document.getElementById("interest");
let finalAmountEl = document.getElementById("finalAmount");
let resultMsgEl = document.getElementById("resultMsg");

let selectedInterest = null;
let days = 0,
    months = 0,
    years = 0,
    totalNumDays = 0;
let simpleInterest = 0,
    compoundInterest = 0,
    totalAmount = 0;

function todaysDate() {
    const today = new Date();
    dayRetInputValueEl.value = today.getDate();
    monthRetInputValueEl.value = today.getMonth() + 1;
    yearRetInputValueEl.value = today.getFullYear();
}

function movetoNext(current, nextFieldID) {
    if (current.value.length >= current.maxLength) {
        document.getElementById(nextFieldID).focus();
    }
}

function calculateTime() {
    let g_day = parseInt(dayGivenInputValueEl.value);
    let g_month = parseInt(monthGivenInputValueEl.value);
    let g_year = parseInt(yearGivenInputValueEl.value);
    let r_day = parseInt(dayRetInputValueEl.value);
    let r_month = parseInt(monthRetInputValueEl.value);
    let r_year = parseInt(yearRetInputValueEl.value);

    if (g_day > r_day) {
        days = r_day + 30 - g_day;
        r_month--;
    } else {
        days = r_day - g_day;
    }

    if (g_month > r_month) {
        months = r_month + 12 - g_month;
        r_year--;
    } else {
        months = r_month - g_month;
    }

    years = r_year - g_year;
    totalNumDays = years * 360 + months * 30 + days;
}

function calculateSimpleInterest(days, months, years, totalNumDays) {
    const principle = parseInt(amountInputEl.value);
    const rate = parseFloat(rateInputEl.value);
    simpleInterest = (principle * (rate / 100) / 360) * totalNumDays;
    totalAmount = simpleInterest + principle;
}

function calculateCompoundInterest(days, months, years) {
    const principle = parseInt(amountInputEl.value);
    const rate = parseFloat(rateInputEl.value);
    let compoundYearlyInterest = Math.pow(1 + rate / 100, years) * principle;
    const totalRemDays = months * 30 + days;
    compoundInterest = (((compoundYearlyInterest * (rate / 100)) / 12) / 30) * totalRemDays + compoundYearlyInterest - principle;
    totalAmount = principle + compoundInterest;
}

SimComEl.addEventListener("change", e => {
    resultMsgEl.textContent = "";
    selectedInterest = e.target.value;
});

function calculatingButton() {
    const errors = [];

    // Reset all borders
    const fieldsToReset = [
        SimComEl, amountInputEl, rateInputEl,
        dayGivenInputValueEl, monthGivenInputValueEl, yearGivenInputValueEl,
        dayRetInputValueEl, monthRetInputValueEl, yearRetInputValueEl
    ];
    fieldsToReset.forEach(field => field.classList.remove("input-error"));

    if (SimComEl.value === "none" || SimComEl.value === "") {
        errors.push("Interest type is required.");
        SimComEl.classList.add("input-error");
    }
    if (amountInputEl.value === "") {
        errors.push("Principal amount is required.");
        amountInputEl.classList.add("input-error");
    }
    if (rateInputEl.value === "") {
        errors.push("Rate of interest is required.");
        rateInputEl.classList.add("input-error");
    }

    if (dayGivenInputValueEl.value === "") {
        errors.push("From date - day is required.");
        dayGivenInputValueEl.classList.add("input-error");
    }
    if (monthGivenInputValueEl.value === "") {
        errors.push("From date - month is required.");
        monthGivenInputValueEl.classList.add("input-error");
    }
    if (yearGivenInputValueEl.value === "") {
        errors.push("From date - year is required.");
        yearGivenInputValueEl.classList.add("input-error");
    }

    if (dayRetInputValueEl.value === "") {
        errors.push("To date - day is required.");
        dayRetInputValueEl.classList.add("input-error");
    }
    if (monthRetInputValueEl.value === "") {
        errors.push("To date - month is required.");
        monthRetInputValueEl.classList.add("input-error");
    }
    if (yearRetInputValueEl.value === "") {
        errors.push("To date - year is required.");
        yearRetInputValueEl.classList.add("input-error");
    }

    if (errors.length > 0) {
        alert("Please fill the following required fields:\n\n" + errors.join("\n"));
        return;
    }

    resultMsgEl.textContent = "";

    calculateTime();

    if (selectedInterest === "SimpleInterest") {
        calculateSimpleInterest(days, months, years, totalNumDays);
    } else {
        calculateCompoundInterest(days, months, years);
    }

    document.getElementById("resYears").textContent = years;
    document.getElementById("resMonths").textContent = months;
    document.getElementById("resDays").textContent = days;
    document.getElementById("resPrincipal").textContent = amountInputEl.value;
    document.getElementById("resRate").textContent = rateInputEl.value;
    document.getElementById("resInterest").textContent = Math.round(
        selectedInterest === "SimpleInterest" ? simpleInterest : compoundInterest
    );
    document.getElementById("resFinalAmount").textContent = Math.round(totalAmount);
    document.getElementById("resInterestType").textContent =
        selectedInterest === "SimpleInterest" ? "Simple" : "Compound";

    document.getElementById("inputPage").style.display = "none";
    document.getElementById("resultPage").style.display = "block";
    // Build DD-MM-YYYY strings and set in result
    document.getElementById("resFromDate").textContent =
        `${dayGivenInputValueEl.value}-${monthGivenInputValueEl.value}-${yearGivenInputValueEl.value}`;
    document.getElementById("resToDate").textContent =
        `${dayRetInputValueEl.value}-${monthRetInputValueEl.value}-${yearRetInputValueEl.value}`;

}



function resetButton() {
    amountInputEl.value = rateInputEl.value = "";
    dayGivenInputValueEl.value = monthGivenInputValueEl.value = yearGivenInputValueEl.value = "";
    dayRetInputValueEl.value = monthRetInputValueEl.value = yearRetInputValueEl.value = "";
    resultMsgEl.textContent = "";
}

function goBack() {
    document.getElementById("resultPage").style.display = "none";
    document.getElementById("inputPage").style.display = "block";
}

function shareResult() {
    const target = document.querySelector('#resultPage'); // what to capture
    const actions = document.getElementById('resultActions'); // buttons row

    // Hide actions during capture
    const originalVisibility = actions ? actions.style.visibility : null;
    if (actions) actions.style.visibility = 'hidden';

    html2canvas(target, {
        useCORS: true,
        scale: window.devicePixelRatio || 1,
        backgroundColor: null
    }).then(canvas => {
        // Restore actions
        if (actions) actions.style.visibility = originalVisibility || '';

        canvas.toBlob(blob => {
            const file = new File([blob], 'interest-result.png', {
                type: 'image/png'
            });

            if (navigator.canShare && navigator.canShare({
                    files: [file]
                })) {
                navigator.share({
                    files: [file],
                    title: 'Interest Calculation Result'
                }).catch(() => downloadImage(canvas));
            } else {
                downloadImage(canvas);
            }
        });
    });
}

function downloadImage(canvas) {
    const link = document.createElement('a');
    link.download = 'interest-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}
