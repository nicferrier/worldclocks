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

// Circle drawing stuff - all credit to: https://www.encodedna.com/html5/canvas/simple-analog-clock-using-canvas-javascript.htm

const circle = function (canvas, ctx, radius) {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#92949C';
    // ctx.fillStyle = '#353535'; // this was used to make the center filled
    ctx.stroke();
}

const radiate = function (canvas, ctx, radials, length, lengthDivider) {
    for (let i = 0; i < 12; i++) {
        angle = (i - 3) * (Math.PI * 2) / radials;
        ctx.lineWidth = 1;   // Hand width.
        ctx.beginPath();
        const x1 = (canvas.width / 2) + Math.cos(angle) * (length);
        const y1 = (canvas.height / 2) + Math.sin(angle) * (length);
        const x2 = (canvas.width / 2) + Math.cos(angle) * (length - (length / lengthDivider));
        const y2 = (canvas.height / 2) + Math.sin(angle) * (length - (length / lengthDivider));
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        
        ctx.strokeStyle = '#466B76';
        ctx.stroke();
    }
}

const drawHand = function (canvas, ctx, val, length, lengthDivider, handWidth) {
    const angle = ((Math.PI * 2) * val) - ((Math.PI * 2) / 4);
    ctx.lineWidth = handWidth;

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);   
    ctx.lineTo((canvas.width / 2 + Math.cos(angle) * (length / lengthDivider)),
               canvas.height / 2 + Math.sin(angle) * (length / lengthDivider));

    // The second hand has a counter balance tail
    if (lengthDivider === 1) {
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo((canvas.width / 2 - Math.cos(angle) * 20),
                   canvas.height / 2 - Math.sin(angle) * 20);
    }
    ctx.strokeStyle = '#586A73';
    ctx.stroke();
}

const showClock = function (date, parentNode) {
    // DEFINE CANVAS AND ITS CONTEXT.
    // var canvas = document.getElementById('canvas');
    const canvas = document.createElement("canvas");
    parentNode.appendChild(canvas);
    canvas.width = 200;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');

    const secHandLength = 60;

    // CLEAR EVERYTHING ON THE CANVAS. RE-DRAW NEW ELEMENTS EVERY SECOND.
    ctx.clearRect(0, 0, canvas.width, canvas.height);        

    circle(canvas, ctx, secHandLength + 10); // outer
    circle(canvas, ctx, secHandLength + 7); // inner
    circle(canvas, ctx, 2); // center

    radiate(canvas, ctx, 12, secHandLength, 7);
    radiate(canvas, ctx, 60, secHandLength, 30);

    const seconds = date.seconds();
    drawHand(canvas, ctx, seconds / 60, secHandLength, 1, 0.5); // Seconds

    const minutes  = date.minutes();
    drawHand(canvas, ctx, minutes / 60, secHandLength, 1.1, 0.6); // Seconds

    const hour = date.hours();
    drawHand(canvas, ctx, ((hour * 5 + (minutes / 60) * 5) / 60), secHandLength, 1.5, 1.5); // Seconds
}

const tzDisplay = function (localTimeMoment, timeElement) {
    const tz = timeElement.getAttribute("data-tz");
    const tzName = timeElement.getAttribute("data-tzname");
    const localTime = localTimeMoment.tz(tz);

    showClock(localTime, timeElement);
    
    const dateString = localTime.format("ll");
    const timeString = localTime.format("LTS");
    
    const locE = document.createElement("span");
    locE.classList.add("location");
    timeElement.appendChild(locE);
    locE.textContent = tzName + " " + localTime.format("z");

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
                zoneChild.innerHTML = "";
                tzDisplay(now, zoneChild);
            });
        });

        timeE.querySelector("button.hours-plus")
            .addEventListener("click", clickEvt => {
                const now = localTimeStore.addHour();
                timeE.querySelector(".timepart.hours")
                    .textContent = now.tz(tz).format("hh");
                
                const zones = document.querySelector(".zones");
                Array.from(zones.children).forEach(zoneChild => {
                    zoneChild.innerHTML = "";
                    tzDisplay(now, zoneChild);
                });
            });
    }

    // And now the minus version
    {
        const buttonMinus = timeE.querySelector("button.mins-minus");
        buttonMinus.addEventListener("click", clickEvt => {
            const now = localTimeStore.minusMin();
            timeE.querySelector(".timepart.mins")
                .textContent = now.tz(tz).format("mm");
            
            const zones = document.querySelector(".zones");
            Array.from(zones.children).forEach(zoneChild => {
                zoneChild.innerHTML = "";
                tzDisplay(now, zoneChild);
            });
        });
        
        timeE.querySelector("button.mins-plus")
            .addEventListener("click", clickEvt => {
                const now = localTimeStore.addMin();
                timeE.querySelector(".timepart.mins")
                    .textContent = now.tz(tz).format("mm");
                
                const zones = document.querySelector(".zones");
                Array.from(zones.children).forEach(zoneChild => {
                    zoneChild.innerHTML = "";
                    tzDisplay(now, zoneChild);
                });
            });
    }
};


window.addEventListener("load", loadEvt => {
    localTimeStore = momentInstance(); // Initialize it
    const localTime = localTimeStore.get();

    const timezoneMap = {
        "GMT": "London",
        "EST": "Toronto",
        "Asia/Chongqing": "Guangzhou",
        "Asia/Kolkata": "Pune"
    };

    const zonesContainer = document.querySelector(".zones");
    
    const clocks = new URLSearchParams(document.cookie).get("worldclock");
    clocks.split(",").forEach(tz => {
        const timeElement = zonesContainer.appendChild(document.createElement("div"));
        timeElement.classList.add("clock");
        const tzName = timezoneMap[tz];
        timeElement.setAttribute("data-tz", tz);
        timeElement.setAttribute("data-tzname", tzName);
        tzDisplay(localTime, timeElement);
    });

    document.querySelector("button[name='add']")
        .addEventListener("click", clickEvt => {
            // Let's add a clock
            const tzChoice = document.querySelector("select");
            const tz = tzChoice.selectedOptions[0].value;

            const timeElement = zonesContainer.appendChild(document.createElement("div"));
            timeElement.classList.add("clock");
            const tzName = tzChoice.selectedOptions[0].textContent;
            timeElement.setAttribute("data-tz", tz);
            timeElement.setAttribute("data-tzname", tzName);
            tzDisplay(localTime, timeElement);

            // Set the cookie to whatever we have
            const zonesList = Array.from(zonesContainer.querySelectorAll(".clock"))
                  .map(clock => clock.getAttribute("data-tz"));
            document.cookie = "worldclock=" + zonesList.join(",");
        });
});

// End
