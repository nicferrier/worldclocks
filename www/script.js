const momentInstance = function () {
    let m = moment();
    return {
        now: function () {
            m = moment();
            return m;
        },

        addHour: function () {
            m.add(1, "hours");
            return m;
        },

        minusHour: function () {
            m.subtract(1, "hours");
            return m;
        },

        addMin: function () {
            m.add(1, "minutes");
            return m;
        },

        minusMin: function () {
            m.subtract(1, "minutes");
            return m;
        },

        get: function () {
            return m;
        }
    };
};

let localTimeStore;

const tzDisplay = function (localTimeMoment, timeElement) {
    const tz = timeElement.getAttribute("data-tz");
    const tzName = timeElement.getAttribute("data-tzname");
    const localTime = localTimeMoment.tz(tz);
    
    const dateString = localTime.format("ll");
    const timeString = localTime.format("LTS");
    
    const locE = document.createElement("span");
    locE.classList.add("location");
    timeElement.appendChild(locE);
    locE.textContent = tzName;

    /*
    const dateE = document.createElement("span");
    dateE.classList.add("date"),
    timeElement.appendChild(dateE);
    dateE.textContent = dateString;
    */

    const timeE = document.createElement("span");
    timeE.classList.add("time");
    timeElement.appendChild(timeE);

    timeE.innerHTML = `<button class="hours-minus">-</button>
<span class="hours timepart">${localTime.format("hh")}</span>
<button class="hours-plus"=">+</button>
<span>:</span>
<button class="mins-minus">-</button>
<span class="mins timepart">${localTime.format("mm")}</span>
<button class="mins-plus"=">+</button>`;

    // Only doing this so I can use the same variable names
    {
        const buttonMinus = timeE.querySelector("button.hours-minus");
        buttonMinus.addEventListener("click", clickEvt => {
            const now = localTimeStore.minusHour();
            timeE.querySelector(".timepart.hours")
                .textContent = now.tz(tz).format("hh");

            const zones = document.querySelector(".zones");
            Array.from(zones.children).forEach(zoneChild => {
                if (zoneChild.getAttribute("data-tz") !== tz) {
                    zoneChild.innerHTML = "";
                    tzDisplay(now, zoneChild);
                }
            });
        });

        timeE.querySelector("button.hours-plus")
            .addEventListener("click", clickEvt => {
                const now = localTimeStore.addHour();
                timeE.querySelector(".timepart.hours")
                    .textContent = now.tz(tz).format("hh");
                
                const zones = document.querySelector(".zones");
                Array.from(zones.children).forEach(zoneChild => {
                    if (zoneChild.getAttribute("data-tz") !== tz) {
                        zoneChild.innerHTML = "";
                        tzDisplay(now, zoneChild);
                    }
                });
            });
    }

    {
        const buttonMinus = timeE.querySelector("button.mins-minus");
        buttonMinus.addEventListener("click", clickEvt => {
            const now = localTimeStore.minusMin();
            timeE.querySelector(".timepart.mins")
                .textContent = now.tz(tz).format("mm");
            
            const zones = document.querySelector(".zones");
            Array.from(zones.children).forEach(zoneChild => {
                if (zoneChild.getAttribute("data-tz") !== tz) {
                    zoneChild.innerHTML = "";
                    tzDisplay(now, zoneChild);
                }
            });
        });
        
        timeE.querySelector("button.mins-plus")
            .addEventListener("click", clickEvt => {
                const now = localTimeStore.addMin();
                timeE.querySelector(".timepart.mins")
                    .textContent = now.tz(tz).format("mm");
                
                const zones = document.querySelector(".zones");
                Array.from(zones.children).forEach(zoneChild => {
                    if (zoneChild.getAttribute("data-tz") !== tz) {
                        zoneChild.innerHTML = "";
                        tzDisplay(now, zoneChild);
                    }
                });
            });
    }

    const tzE = document.createElement("span");
    timeE.classList.add("tz");
    timeElement.appendChild(tzE);
    tzE.textContent = localTime.format("z");
};


window.addEventListener("load", loadEvt => {
    localTimeStore = momentInstance(); // Initialize it
    const localTime = localTimeStore.get();
    document.querySelector("button[name='add']")
        .addEventListener("click", clickEvt => {
            // Let's add a clock
            const tzChoice = document.querySelector("select");
            const tz = tzChoice.selectedOptions[0].value;

            const zonesContainer = document.querySelector(".zones");
            const timeElement = zonesContainer.appendChild(document.createElement("div"));
            timeElement.classList.add("clock");
            const tzName = tzChoice.selectedOptions[0].textContent;
            timeElement.setAttribute("data-tz", tz);
            timeElement.setAttribute("data-tzname", tzName);
            tzDisplay(localTime, timeElement);
        });
});

// End
