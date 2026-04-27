
              document.write(new Date().toLocaleDateString());
            

      let isAr = true;
      let isDark = false;

      const AppState = {
        totalKwh: 0,
        activeCount: 0,
        devices: [
          { id: "dev_mock1", name: "Living Room AC", brand: "Samsung", type: "ac", power: 1500, icon: "fas fa-snowflake", color: "#00b4d8", isActive: true },
          { id: "dev_mock2", name: "Kitchen Fridge", brand: "LG", type: "fridge", power: 250, icon: "fas fa-box", color: "#06b6d4", isActive: true },
          { id: "dev_mock3", name: "Main TV", brand: "Sony", type: "tv", power: 100, icon: "fas fa-tv", color: "#8a2be2", isActive: true },
          { id: "dev_mock4", name: "Water Heater", brand: "Ariston", type: "heater", power: 2000, icon: "fas fa-fire", color: "#ff1744", isActive: false },
          { id: "dev_mock5", name: "Bedroom Lights", brand: "Philips", type: "light", power: 60, icon: "fas fa-lightbulb", color: "#ffea00", isActive: true },
        ],
        tariffs: { t1: 0.58, t2: 0.68, t3: 0.83, t4: 1.25 },
        typeIcons: {
          ac: "fas fa-snowflake",
          fridge: "fas fa-box",
          tv: "fas fa-tv",
          washer: "fas fa-tint",
          heater: "fas fa-fire",
          light: "fas fa-lightbulb",
          other: "fas fa-plug",
        },
        typeColors: {
          ac: "#00b4d8",
          fridge: "#06b6d4",
          tv: "#8a2be2",
          washer: "#ec4899",
          heater: "#ff1744",
          light: "#ffea00",
          other: "#00e676",
        },
      };

      window.onload = function () {
        try {
          initNetworkCanvas();
        } catch (e) {}
        setTimeout(function () {
          switchScreen("splashScreen", "loginScreen");
        }, 2500);
      };

      function switchScreen(hideId, showId) {
        const screens = document.querySelectorAll(".screen");
        for (let i = 0; i < screens.length; i++) {
          screens[i].classList.remove("active");
        }
        const targetScreen = document.getElementById(showId);
        if (targetScreen) {
          targetScreen.classList.add("active");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }

      let currentLoginType = "user";

      function switchLoginTab(type) {
        currentLoginType = type;
        const tabUser = document.getElementById("tabUser");
        const tabAdmin = document.getElementById("tabAdmin");
        const idLabel = document.getElementById("loginIdLabel");
        const idInput = document.getElementById("loginId");
        const idIcon = document.getElementById("loginIdIcon");
        const title = document.getElementById("loginTitle");
        const btnStyle = document.getElementById("loginBtnStyle");
        const regLink = document.getElementById("registerLinkSection");

        if (type === "admin") {
          tabAdmin.style.background = "var(--admin)";
          tabAdmin.style.color = "white";
          tabUser.style.background = "transparent";
          tabUser.style.color = "var(--text-muted)";
          title.innerText = isAr
            ? "بوابة الإدارة المركزية WATTO"
            : "WATTO Admin Portal";
          idLabel.innerText = isAr
            ? "معرف واسم الدخول للإدارة"
            : "Admin ID / Username";
          idInput.placeholder = isAr
            ? "أدخل اسم المستخدم (admin)"
            : "Enter Username (admin)";
          idIcon.className = "fas fa-user-shield";
          btnStyle.style.background =
            "linear-gradient(135deg, #a855f7, #8b5cf6)";
          btnStyle.style.boxShadow = "0 0 15px rgba(138, 43, 226, 0.5)";
          regLink.style.display = "none";
        } else {
          tabUser.style.background = "var(--primary)";
          tabUser.style.color = "white";
          tabAdmin.style.background = "transparent";
          tabAdmin.style.color = "var(--text-muted)";
          title.innerText = isAr ? "تسجيل دخول المستخدم" : "User Login";
          idLabel.innerText = isAr
            ? "الرقم القومي (14 رقم)"
            : "National ID (14 digits)";
          idInput.placeholder = isAr
            ? "أدخل الرقم القومي"
            : "Enter National ID";
          idIcon.className = "fas fa-id-card";
          btnStyle.style.background =
            "linear-gradient(135deg, var(--primary), var(--primary-dark))";
          btnStyle.style.boxShadow = "var(--glow)";
          regLink.style.display = "block";
        }
      }

      function handleLogin(event) {
        if (event) event.preventDefault();
        const idVal = document.getElementById("loginId").value.trim();
        const passVal = document.getElementById("loginPass").value.trim();

        if (currentLoginType === "admin") {
          if (idVal === "admin" && passVal === "Admin@2026") {
            switchScreen("loginScreen", "adminDashboardScreen");
            showToast(
              isAr
                ? "تم التحقق. مرحباً بك في لوحة الإدارة."
                : "Verified. Welcome to Admin Dashboard.",
              "success",
            );
          } else {
            alert(
              isAr
                ? "بيانات غير صحيحة! (استخدم: admin / Admin@2026)"
                : "Admin credentials incorrect!",
            );
          }
        } else {
          const isIdValid =
            /^(2|3)[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[0-9]{2}[0-9]{5}$/.test(
              idVal,
            );
          if (isIdValid && passVal.length >= 6) {
            switchScreen("loginScreen", "appliancesScreen");
            showToast(
              isAr ? "تم تسجيل الدخول بنجاح." : "Login successful.",
              "success",
            );
          } else {
            alert(
              isAr
                ? "برجاء إدخال رقم قومي 14 رقم صحيح وكلمة مرور 6 أحرف على الأقل."
                : "Invalid ID or Password.",
            );
          }
        }
      }

      function selectPlaceType(el, type) {
        const items = document.querySelectorAll(".place-type-item");
        for (let i = 0; i < items.length; i++) {
          items[i].classList.remove("selected");
          items[i].style.borderColor = "var(--border-color)";
          items[i].style.background = "var(--input-bg)";
          let icon = items[i].querySelector("i");
          let span = items[i].querySelector("span");
          if (icon) icon.style.color = "var(--text-muted)";
          if (span) span.style.color = "var(--text-color)";
        }

        el.classList.add("selected");

        const otherInput = document.getElementById("otherPlaceInput");
        if (type === "other") {
          otherInput.style.display = "block";
          document.getElementById("customPlace").required = true;
        } else {
          otherInput.style.display = "none";
          document.getElementById("customPlace").required = false;
        }
      }

      function handleRegister(event) {
        event.preventDefault();
        const nationalId = document.getElementById("regNationalId").value;
        const isValidId =
          /^(2|3)[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[0-9]{2}[0-9]{5}$/.test(
            nationalId,
          );

        if (!isValidId) {
          alert(
            isAr
              ? "عذراً، الرقم القومي المُدخل غير صحيح!"
              : "Sorry, invalid National ID!",
          );
          return;
        }

        const pass = document.getElementById("regPassword").value;
        const confirmPass = document.getElementById("regConfirmPass").value;
        if (pass !== confirmPass) {
          alert(
            isAr ? "كلمتا المرور غير متطابقتين." : "Passwords do not match.",
          );
          return;
        }

        let placeTypeSelected = false;
        const placeItems = document.querySelectorAll(".place-type-item");
        for (let i = 0; i < placeItems.length; i++) {
          if (placeItems[i].classList.contains("selected")) {
            placeTypeSelected = true;
            break;
          }
        }

        if (!placeTypeSelected) {
          alert(
            isAr ? "برجاء اختيار نوع المكان!" : "Please select a place type!",
          );
          return;
        }

        switchScreen("registerScreen", "chooseMeterMethodScreen");
      }

      function scanNFC() {
        showToast(
          isAr
            ? "سيتم ربط هذه الخاصية بالهاردوير قريباً."
            : "This feature will be linked to hardware soon.",
          "success",
        );
      }

      function handleMeterSubmit(event) {
        event.preventDefault();
        switchScreen("manualMeterScreen", "appliancesScreen");
        showToast(
          isAr ? "تم التحقق من العداد بنجاح." : "Meter verified successfully.",
          "success",
        );
      }

      function addCustomDevice() {
        const nameInput = document.getElementById("devNameInput");
        const brandInput = document.getElementById("devBrandInput");
        const typeInput = document.getElementById("devTypeInput");
        const powerInput = document.getElementById("devPowerInput");

        const name = nameInput.value.trim();
        const brand = brandInput ? brandInput.value.trim() : "";
        const type = typeInput.value;
        const power = parseInt(powerInput.value);

        if (name === "" || isNaN(power) || power <= 0) {
          alert(
            isAr
              ? "برجاء كتابة اسم وقدرة الجهاز بشكل صحيح."
              : "Please write a valid name and power.",
          );
          return;
        }

        const device = {
          id: "dev_" + Date.now(),
          name: name,
          brand: brand || (isAr ? "غير محدد" : "Unknown"),
          type: type,
          power: power,
          icon: AppState.typeIcons[type],
          color: AppState.typeColors[type],
          isActive: true,
        };

        AppState.devices.push(device);
        renderAddedDevices();

        nameInput.value = "";
        if (brandInput) brandInput.value = "";
        powerInput.value = "";
      }

      function renderAddedDevices() {
        const grid = document.getElementById("addedDevicesGrid");
        grid.innerHTML = "";

        if (AppState.devices.length === 0) {
          grid.innerHTML = `<p id="emptyDeviceMsg" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); font-size: 1.2rem; border: 2px dashed var(--border-color); border-radius: 20px;" data-i18n="empty_devices">${isAr ? "لم تقم بإضافة أي أجهزة بعد." : "No devices added yet."}</p>`;
          return;
        }

        for (let i = 0; i < AppState.devices.length; i++) {
          let dev = AppState.devices[i];
          grid.innerHTML += `
                <div class="device-card">
                    <button type="button" class="remove-dev-btn" onclick="removeDevice(${i})"><i class="fas fa-times"></i></button>
                    <div class="icon-circle" style="color: ${dev.color}; background: ${dev.color}15;">
                        <i class="${dev.icon}"></i>
                    </div>
                    <h4>${dev.name}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">
                        <i class="fas fa-industry"></i> ${dev.brand}
                    </p>
                    <p>${dev.power} Watt</p>
                </div>
            `;
        }
      }

      function removeDevice(index) {
        AppState.devices.splice(index, 1);
        renderAddedDevices();
      }

      function proceedToDashboard() {
        if (AppState.devices.length === 0) {
          alert(isAr ? "أضف جهاز واحد على الأقل." : "Add at least one device.");
          return;
        }
        buildIoTControls();
        updateSystemCalculations();
        updateTopConsumers();
        updateAdminTable();
        switchScreen("appliancesScreen", "dashboardScreen");
        setTimeout(initChart, 500);
      }

      function buildIoTControls() {
        const grid = document.getElementById("iotControlsGrid");
        grid.innerHTML = "";

        for (let i = 0; i < AppState.devices.length; i++) {
          let dev = AppState.devices[i];
          let activeClass = dev.isActive ? "active" : "";

          let iconStyle = dev.isActive
            ? `background: ${dev.color}; color: white; box-shadow: 0 0 20px ${dev.color}66; border: none;`
            : `color: ${dev.color}; background: var(--bg-color); border: 1px solid var(--border-color);`;

          let toggleBg = dev.isActive ? `background: ${dev.color};` : "";
          let toggleTrans = dev.isActive
            ? isAr
              ? "transform: translateX(-28px);"
              : "transform: translateX(28px);"
            : "";

          grid.innerHTML += `
                <div class="iot-device ${activeClass}" id="iotUI_${dev.id}" style="${dev.isActive ? `border-color: ${dev.color}; box-shadow: 0 10px 30px ${dev.color}25;` : ""}">
                    <div class="icon-wrapper" style="${iconStyle}"><i class="${dev.icon}"></i></div>
                    <h4 style="margin-bottom: 2px; font-weight: 800; font-size: 1.15rem; color: var(--text-color);">${dev.name}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
                        <i class="fas fa-industry"></i> ${dev.brand}
                    </p>
                    <p class="text-muted" style="font-size: 0.95rem; font-weight: bold;">
                        <i class="fas fa-bolt" style="color:var(--gold)"></i> ${isAr ? "سحب:" : "Draw:"} ${dev.power} Watt
                    </p>
                    <div class="toggle-switch" style="${toggleBg}" onclick="toggleDevicePower('${dev.id}')">
                        <div style="content: ''; position: absolute; top: 4px; left: 4px; width: 24px; height: 24px; background: white; border-radius: 50%; transition: transform 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.2); ${toggleTrans}"></div>
                    </div>
                </div>
            `;
        }
      }

      function toggleDevicePower(devId) {
        const dev = AppState.devices.find((d) => d.id === devId);
        if (dev) {
          dev.isActive = !dev.isActive;
          if (dev.isActive) {
            showToast(
              isAr ? `تم تشغيل (${dev.name}) بنجاح.` : `${dev.name} turned ON.`,
              "success",
            );
          } else {
            showToast(
              isAr
                ? `تم فصل (${dev.name}) للحفاظ على الطاقة.`
                : `${dev.name} turned OFF.`,
              "error",
            );
          }

          buildIoTControls();
          updateSystemCalculations();
          updateTopConsumers();
          updateAdminTable();

          if (window.myChart) {
            window.myChart.data.datasets[0].data[3] = AppState.totalKwh / 4;
            window.myChart.update();
          }
        }
      }

      function updateSystemCalculations() {
        let activeKw = 0;
        let activeCount = 0;
        for (let i = 0; i < AppState.devices.length; i++) {
          if (AppState.devices[i].isActive) {
            activeKw += AppState.devices[i].power / 1000;
            activeCount++;
          }
        }
        let monthlyKwh = activeKw * 8 * 30;

        let bill = 0;
        if (monthlyKwh <= 50) {
          bill = monthlyKwh * AppState.tariffs.t1;
        } else if (monthlyKwh <= 100) {
          bill =
            50 * AppState.tariffs.t1 + (monthlyKwh - 50) * AppState.tariffs.t2;
        } else if (monthlyKwh <= 200) {
          bill = monthlyKwh * AppState.tariffs.t3;
        } else {
          bill = monthlyKwh * AppState.tariffs.t4;
        }

        AppState.totalKwh = Math.round(monthlyKwh);
        AppState.activeCount = activeCount;

        let uiKwh = document.getElementById("uiTotalKwh");
        if (uiKwh) {
          uiKwh.innerHTML =
            AppState.totalKwh +
            ' <span style="font-size: 1.2rem; font-weight: normal; opacity: 0.8;">kWh</span>';
        }

        let uiBill = document.getElementById("uiTotalBill");
        if (uiBill) {
          uiBill.innerHTML =
            Math.round(bill) +
            ` <span style="font-size: 1.2rem; font-weight: normal; opacity: 0.8;">${isAr ? "ج.م" : "EGP"}</span>`;
        }

        let uiActive = document.getElementById("uiActiveCount");
        if (uiActive) {
          uiActive.innerText = activeCount;
        }

        // تحديث شاشة التوقع (Forecasting)
        let forecastKwh = Math.round(monthlyKwh * 1.15); // AI Prediction (15% increase trend)
        let forecastUI = document.getElementById("forecastValueUI");
        if (forecastUI) {
          forecastUI.innerHTML =
            forecastKwh +
            ' <span style="font-size: 1.8rem; color: var(--text-muted); font-weight: normal;">kWh</span>';
        }
        let tipsUI = document.getElementById("forecastSavingTips");
        if (tipsUI) {
          tipsUI.innerText = isAr
            ? `نصيحة الذكاء الاصطناعي: إذا قمت بتقليل الاستهلاك بمقدار 10% فقط، ستوفر حوالي ${Math.round(forecastKwh * 0.1 * AppState.tariffs.t3)} ج.م من فاتورة الشهر القادم.`
            : `AI Tip: By reducing 10% usage, you could save roughly ${Math.round(forecastKwh * 0.1 * AppState.tariffs.t3)} EGP next month.`;
        }
        
        let dailyCostUI = document.getElementById("dailyCostUI");
        if (dailyCostUI) {
            let dailyCost = Math.round(bill / 30);
            dailyCostUI.innerHTML = dailyCost + ` <span style="font-size: 1rem; color: var(--text-muted); font-weight: normal;">${isAr ? "ج.م" : "EGP"}</span>`;
        }
        
        let projectedMonthlyUI = document.getElementById("projectedMonthlyUI");
        if (projectedMonthlyUI) {
            projectedMonthlyUI.innerHTML = Math.round(bill) + ` <span style="font-size: 1rem; color: var(--text-muted); font-weight: normal;">${isAr ? "ج.م" : "EGP"}</span>`;
        }

        updateEnergyDistributionChart();
      }

      function updateEnergyDistributionChart() {
        const canvas = document.getElementById("energyDistributionChart");
        if (!canvas) return;

        let categoryPower = {
            "Cooling": 0,
            "Heating": 0,
            "Lighting": 0,
            "Appliances": 0
        };

        for (let i = 0; i < AppState.devices.length; i++) {
            if (AppState.devices[i].isActive) {
                let type = AppState.devices[i].type;
                let power = AppState.devices[i].power;
                if (type === "ac" || type === "fridge") categoryPower["Cooling"] += power;
                else if (type === "heater") categoryPower["Heating"] += power;
                else if (type === "light") categoryPower["Lighting"] += power;
                else categoryPower["Appliances"] += power;
            }
        }

        let textColor = getComputedStyle(document.documentElement).getPropertyValue("--text-color").trim();

        if (window.energyChartInstance) {
            window.energyChartInstance.destroy();
        }

        const ctx = canvas.getContext("2d");
        window.energyChartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: isAr ? ["التبريد", "التسخين", "الإضاءة", "أخرى"] : ["Cooling", "Heating", "Lighting", "Appliances"],
                datasets: [{
                    data: [categoryPower["Cooling"], categoryPower["Heating"], categoryPower["Lighting"], categoryPower["Appliances"]],
                    backgroundColor: [
                        "#00b4d8", // Blue
                        "#ff4d4d", // Red
                        "#fee440", // Yellow
                        "#8a2be2"  // Purple
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: textColor,
                            font: { family: "Cairo", size: 14, weight: "bold" },
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        titleFont: { family: "Cairo", size: 14 },
                        bodyFont: { family: "Cairo", size: 14, weight: "bold" },
                        padding: 15,
                        cornerRadius: 12,
                    }
                }
            }
        });
      }

      function updateTopConsumers() {
        const list = document.getElementById("topConsumersList");
        if (!list) return;

        list.innerHTML = "";
        let totalActivePower = 0;
        for (let i = 0; i < AppState.devices.length; i++) {
          if (AppState.devices[i].isActive)
            totalActivePower += AppState.devices[i].power;
        }

        if (totalActivePower === 0) {
          list.innerHTML = `
                <div style="text-align: center; padding: 50px; background: rgba(0, 230, 118, 0.1); border-radius: 20px; border: 2px dashed var(--eco-green);">
                    <i class="fas fa-leaf" style="font-size: 4rem; color: var(--eco-green); margin-bottom: 20px; text-shadow: 0 0 15px var(--eco-green);"></i>
                    <h3 style="color: var(--eco-green); font-size: 1.5rem;">${isAr ? "أداء ممتاز!" : "Excellent Performance!"}</h3>
                    <p style="font-size: 1.1rem; color: var(--text-color); margin-top: 10px;">${isAr ? "جميع الأجهزة مغلقة حالياً." : "All devices are off."}</p>
                </div>`;
          return;
        }

        let activeDevices = AppState.devices.filter((d) => d.isActive);
        activeDevices.sort((a, b) => b.power - a.power);

        for (let i = 0; i < activeDevices.length; i++) {
          let dev = activeDevices[i];
          let percent = Math.round((dev.power / totalActivePower) * 100);
          let devMonthlyKwh = (dev.power / 1000) * 8 * 30;
          let devCost = Math.round(devMonthlyKwh * AppState.tariffs.t3);

          list.innerHTML += `
                <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 30px; border-radius: 20px; box-shadow: var(--shadow-sm);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <span style="display:flex; align-items:center; gap:15px; font-weight: 800; font-size: 1.3rem; color: var(--text-color);">
                            <div style="width: 45px; height: 45px; background: ${dev.color}20; color: ${dev.color}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
                                <i class="${dev.icon}"></i>
                            </div>
                            ${dev.name}
                        </span>
                        <span style="color: ${dev.color}; font-weight: 900; font-size: 1.4rem; text-shadow: 0 0 8px ${dev.color}80;">${percent}%</span>
                    </div>
                    <div style="display: flex; gap: 30px; font-size: 1.05rem; color: var(--text-muted); font-weight: bold; margin-bottom: 20px;">
                        <span><i class="fas fa-bolt" style="color: var(--gold);"></i> ${isAr ? "القدرة الحقيقية:" : "Real Power:"} ${dev.power} Watt</span>
                        <span><i class="fas fa-wallet" style="color: var(--eco-green);"></i> ${isAr ? "التكلفة الشهرية:" : "Monthly Cost:"} ${devCost} ${isAr ? "ج.م" : "EGP"}</span>
                    </div>
                    <div class="progress-bg">
                        <div class="progress-fill" style="background: ${dev.color}; width: ${percent}%;"></div>
                    </div>
                </div>
            `;
        }
      }

      function updateAdminTable() {
        const tableBody = document.getElementById("adminTableBody");
        if (!tableBody) return;

        const existingRow = document.getElementById("currentUserAdminRow");
        if (existingRow) existingRow.remove();

        let monthlyKwh = AppState.totalKwh;
        let statusBadge = "";
        if (monthlyKwh === 0) {
          statusBadge = `<span class="badge badge-success"><i class="fas fa-power-off"></i> ${isAr ? "لا يوجد استهلاك" : "No Consumption"}</span>`;
        } else if (monthlyKwh < 300) {
          statusBadge = `<span class="badge badge-success"><i class="fas fa-check-circle"></i> ${isAr ? "استهلاك مستقر" : "Stable"}</span>`;
        } else if (monthlyKwh < 600) {
          statusBadge = `<span class="badge badge-warning"><i class="fas fa-chart-line"></i> ${isAr ? "استهلاك متزايد" : "Rising"}</span>`;
        } else {
          statusBadge = `<span class="badge badge-danger"><i class="fas fa-exclamation-triangle"></i> ${isAr ? "خطر تجاوز السعة" : "Peak Warning"}</span>`;
        }

        let fullNameInput = document.getElementById("regFullName");
        let fullName =
          fullNameInput && fullNameInput.value
            ? fullNameInput.value
            : isAr
              ? "المستخدم الحالي (Live)"
              : "Current User";

        let idInput = document.getElementById("regNationalId");
        let nationalId =
          idInput && idInput.value ? idInput.value : "Live_Session";

        let monthlyBill = document.getElementById("uiTotalBill")
          ? document.getElementById("uiTotalBill").innerText.split(" ")[0]
          : "0";

        const newRow = `
            <tr id="currentUserAdminRow" style="background: rgba(0, 180, 216, 0.04); border-left: 4px solid var(--primary);">
                <td>
                    <strong style="font-size: 1.1rem; color: var(--primary);">${fullName}</strong><br>
                    <small style="color: var(--text-muted); font-weight: bold;"><i class="fas fa-satellite-dish"></i> ${isAr ? "بيانات الداشبورد الحية" : "Live Data"}</small>
                </td>
                <td style="font-family: monospace; font-size: 1.15rem; color: var(--text-muted);">${nationalId}</td>
                <td style="font-weight: 900; font-size: 1.2rem; color: var(--text-color);">${monthlyKwh}</td>
                <td style="font-weight: bold; font-size: 1.1rem;">${monthlyBill}</td>
                <td>${statusBadge}</td>
                <td><button type="button" class="btn-primary btn-outline" style="padding: 10px 15px; font-size: 0.95rem; border-radius: 8px; border-color: var(--admin); color: var(--admin); width: 100px;">${isAr ? "إدارة الحساب" : "Manage"}</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("afterbegin", newRow);
      }

      function updateAdminTariffs() {
        const t1 = parseFloat(document.getElementById("t1Price").value);
        const t2 = parseFloat(document.getElementById("t2Price").value);
        const t3 = parseFloat(document.getElementById("t3Price").value);
        if (isNaN(t1) || isNaN(t2) || isNaN(t3)) {
          alert(
            isAr
              ? "الرجاء إدخال أرقام صحيحة لتسعيرة الشرائح."
              : "Valid numbers required.",
          );
          return;
        }
        AppState.tariffs.t1 = t1;
        AppState.tariffs.t2 = t2;
        AppState.tariffs.t3 = t3;
        updateSystemCalculations();
        updateTopConsumers();
        updateAdminTable();
        showToast(
          isAr ? "تم التحديث بالشبكة بنجاح." : "Updated successfully.",
          "success",
        );
      }

      function showToast(message, type = "success") {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.style.background = "var(--card-bg)";
        toast.style.borderRight =
          type === "success"
            ? "5px solid var(--eco-green)"
            : "5px solid var(--danger)";
        toast.style.padding = "20px 30px";
        toast.style.borderRadius = "16px";
        toast.style.boxShadow = "var(--shadow-lg)";
        toast.style.fontWeight = "800";
        toast.style.fontSize = "1.05rem";
        toast.style.display = "flex";
        toast.style.gap = "15px";
        toast.style.alignItems = "center";
        toast.style.animation = "slideUpFade 0.4s ease forwards";

        let iconClass =
          type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
        let iconColor =
          type === "success" ? "var(--eco-green)" : "var(--danger)";
        toast.innerHTML = `<i class="fas ${iconClass}" style="color: ${iconColor}; font-size: 1.4rem;"></i> <span style="color:var(--text-color)">${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(20px)";
          setTimeout(() => {
            if (toast.parentNode) toast.remove();
          }, 400);
        }, 4000);
      }

      function toggleEcoMode(el) {
        el.classList.toggle("active");
        const textSpan = el.querySelector("span");
        if (el.classList.contains("active")) {
          textSpan.style.color = "var(--eco-green)";
          textSpan.style.textShadow = "0 0 10px var(--eco-green)";
          showToast(
            isAr ? "تم تفعيل الذكاء الاصطناعي." : "AI Activated.",
            "success",
          );
        } else {
          textSpan.style.color = "var(--text-color)";
          textSpan.style.textShadow = "none";
          showToast(
            isAr ? "تم إيقاف وضع التوفير." : "AI Deactivated.",
            "error",
          );
        }
      }

      function generatePDF() {
        showToast(
          isAr
            ? "جاري تجهيز تقرير الاستهلاك المعتمد..."
            : "Preparing official report...",
          "success",
        );
        document.getElementById("pdfKwh").innerText = AppState.totalKwh;
        document.getElementById("pdfBill").innerText = document
          .getElementById("uiTotalBill")
          .innerText.split(" ")[0];
        const element = document.getElementById("pdfReport");
        element.style.display = "block";
        html2pdf()
          .set({
            margin: 0.5,
            filename: "WATTO_Report.pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          })
          .from(element)
          .save()
          .then(() => {
            element.style.display = "none";
          });
      }

      function initChart() {
        const canvas = document.getElementById("mainChart");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(0, 180, 216, 0.6)");
        gradient.addColorStop(1, "rgba(0, 180, 216, 0.05)");

        if (window.myChart) {
          window.myChart.destroy();
        }
        let currentWeeklyKwh = AppState.totalKwh / 4;
        let textColor = getComputedStyle(document.documentElement)
          .getPropertyValue("--text-color")
          .trim();
        let gridColor = getComputedStyle(document.documentElement)
          .getPropertyValue("--border-color")
          .trim();
        let labels = isAr
          ? [
              "الأسبوع الأول",
              "الأسبوع الثاني",
              "الأسبوع الثالث",
              "الأسبوع الحالي",
            ]
          : ["Week 1", "Week 2", "Week 3", "Current Week"];

        window.myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: isAr ? "معدل السحب (kWh)" : "Draw (kWh)",
                data: [120, 180, 140, currentWeeklyKwh],
                borderColor: "#00b4d8",
                borderWidth: 5,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#00b4d8",
                pointBorderWidth: 3,
                pointRadius: 8,
                pointHoverRadius: 10,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleFont: { family: "Cairo", size: 14 },
                bodyFont: { family: "Cairo", size: 14, weight: "bold" },
                padding: 15,
                cornerRadius: 12,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: gridColor, borderDash: [5, 5] },
                ticks: {
                  color: textColor,
                  font: { family: "Cairo", size: 12, weight: "bold" },
                },
              },
              x: {
                grid: { display: false },
                ticks: {
                  color: textColor,
                  font: { family: "Cairo", size: 13, weight: "bold" },
                },
              },
            },
          },
        });
      }

      function toggleChatbot() {
        document.getElementById("chatbotWindow").classList.toggle("open");
      }
      function handleChatEnter(e) {
        if (e.key === "Enter") sendChatMessage();
      }

      function sendChatMessage() {
        const input = document.getElementById("chatInput");
        const text = input.value.trim().toLowerCase();
        if (text === "") return;

        const chatBody = document.getElementById("chatBody");
        const userMsg = document.createElement("div");
        userMsg.className = "chat-msg user";
        userMsg.innerText = input.value;
        chatBody.appendChild(userMsg);

        input.value = "";
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(() => {
          const botMsg = document.createElement("div");
          botMsg.className = "chat-msg bot";

          let reply = "";
          
          if (text.includes("ahlan") || text.includes("اهلا") || text.includes("أهلا")) {
            reply = isAr ? "مرحباً بك! كيف يمكنني مساعدتك في إدارة استهلاكك اليوم؟" : "Marhaban! How can I help you manage your energy today?";
          } else if (text === "hi" || text === "hello" || text === "hey") {
            reply = isAr ? "أهلاً بك! أنا مساعدك الذكي للطاقة. ماذا يمكنني أن أفعل لك؟" : "Hi there! I'm your smart energy assistant. What can I do for you?";
          } else if (text.includes("how are you") || text.includes("كيف حالك") || text.includes("عامل ايه")) {
            reply = isAr ? "أنا بخير جداً وأعمل بكامل طاقتي! جاهز لمساعدتك في توفير الكهرباء، وأنت كيف حالك؟" : "I'm doing great and running at full efficiency! Ready to help you save some energy. How are you?";
          } else if (text.includes("fine") || text.includes("good") || text.includes("بخير") || text.includes("الحمد لله")) {
            reply = isAr ? "دائماً يارب! هل تود إلقاء نظرة على تقرير استهلاكك اليوم؟" : "Glad to hear that! Would you like to take a look at your daily consumption report?";
          } else if (text.includes("تكييف") || text.includes("ac")) {
            reply = isAr
              ? "التكييف هو أكبر مستهلك! أنصحك بضبطه على 24 درجة وتفعيل ميزة الـ AI الخاص بي لفصله في أوقات الذروة."
              : "AC consumes the most! Set it to 24C and activate AI mode.";
          } else if (text.includes("سخان") || text.includes("heater")) {
            reply = isAr
              ? "سخان المياه يفضل تشغيله قبل الاستخدام بنصف ساعة فقط، وتأكد من صيانته لعدم سحب طاقة مضاعفة."
              : "Turn on the water heater just 30 mins before use for optimal saving.";
          } else if (text.includes("فاتورة") || text.includes("bill")) {
            const billEl = document.getElementById("uiTotalBill");
            const billAmt = billEl ? billEl.innerText : "0";
            reply = isAr
              ? `فاتورتك التقديرية الحالية بناءً على الأجهزة النشطة هي ${billAmt}. يمكنك فصل بعض الأجهزة من لوحة التحكم (Live) لمشاهدة التخفيض اللحظي.`
              : `Your estimated bill based on active devices is ${billAmt}. Turn off some devices in the Live dashboard to see the instant reduction.`;
          } else {
            const repliesAr = [
              "فهمتك، أنا هنا دائمًا للمساعدة في أي استفسار يخص أجهزتك.",
              "معلومة رائعة! لا تنسَ مراجعة لوحة التحكم بانتظام لمتابعة أداء نظامك.",
              "أنا أتعلم باستمرار من عادات استهلاكك لأقدم لك أفضل نصائح التوفير.",
              "هل ترغب في أن أقوم بتفعيل وضع التوفير الذكي (AI) نيابة عنك الآن؟"
            ];
            const repliesEn = [
              "I understand. I'm always here to help with any questions about your appliances.",
              "Great point! Don't forget to regularly check the dashboard to monitor your system.",
              "I am continuously learning from your habits to provide the best saving tips.",
              "Would you like me to activate the AI Eco Mode for you right now?"
            ];
            reply = isAr
              ? repliesAr[Math.floor(Math.random() * repliesAr.length)]
              : repliesEn[Math.floor(Math.random() * repliesEn.length)];
          }

          botMsg.innerText = reply;
          chatBody.appendChild(botMsg);
          chatBody.scrollTop = chatBody.scrollHeight;
        }, 800);
      }

      function toggleTheme() {
        isDark = !isDark;
        document.documentElement.setAttribute(
          "data-theme",
          isDark ? "dark" : "light",
        );
        const icons = document.querySelectorAll(".theme-icon");
        for (let i = 0; i < icons.length; i++) {
          icons[i].className = isDark
            ? "fas fa-sun theme-icon"
            : "fas fa-moon theme-icon";
        }
        setTimeout(() => {
          initChart();
          updateSystemCalculations();
        }, 50);
      }

      const dict = {
        ar: {
          lang_btn: "EN",
          login_title: "تسجيل دخول المستخدم",
          login_id_label: "الرقم القومي (14 رقم)",
          password_label: "كلمة المرور",
          login_btn: "تسجيل الدخول",
          no_account: "ليس لديك حساب؟",
          create_account: "إنشاء حساب جديد",
          create_account_title: "إنشاء حساب في WATTO",
          full_name_label: "الاسم بالكامل (الرباعي)",
          password_rules_label:
            "كلمة المرور (6 أحرف، يجب أن تحتوي على حروف وأرقام)",
          confirm_pass_label: "تأكيد كلمة المرور",
          region_label: "المنطقة / الحي",
          address_label: "العنوان بالتفصيل",
          area_label: "مساحة المكان (متر مربع)",
          family_role_label: "دورك في الأسرة",
          select_option: "اختر...",
          father: "أب / عائل",
          mother: "أم",
          working: "فرد عامل",
          not_working: "طالب / غير عامل",
          tier_label: "الشريحة الحالية للكهرباء",
          t1: "شريحة 1 (0 - 50)",
          t2: "شريحة 2 (51 - 100)",
          t3: "شريحة 3 (101 - 200)",
          t4: "شريحة 4 (201 - 350)",
          t5: "شريحة 5 (351 - 650)",
          t6: "شريحة 6 (651 - 1000)",
          t7: "شريحة 7 (+1000)",
          place_type: "برجاء تحديد نوع المكان:",
          apartment: "شقة",
          villa: "فيلا",
          company: "شركة",
          building: "عمارة",
          other: "أخرى",
          other_place_label: "نوع المكان",
          back_login: "رجوع لتسجيل الدخول",
          continue_meter: "متابعة لربط العداد",

          choose_meter_method: "طريقة ربط العداد",
          method_manual: "إدخال يدوي",
          method_nfc: "مسح NFC",
          nfc_desc: "قم بتقريب الهاتف من العداد الذكي للربط التلقائي",
          manual_desc: "إدخال بيانات وقراءة العداد بنفسك يدوياً",

          manual_meter: "الإدخال اليدوي لبيانات العداد",
          meter_8_label: "رقم العداد (8 أرقام)",
          monthly_cons_label: "الاستهلاك الشهري (kWh)",
          meter_photo: "صورة العداد:",
          photo_note: "تحديث كل 5 أيام.",
          verify_continue: "متابعة",
          back_options: "رجوع",
          choose_appliances: "بناء بيئة المنزل الذكي",
          appliances_notice:
            "أضف أجهزتك الكهربائية بقدراتها الحقيقية (بالوات) ليتمكن الذكاء الاصطناعي من تتبعها.",
          device_name_label: "اسم الجهاز",
          device_type_label: "تصنيف الجهاز",
          device_power_label: "القدرة (Watt)",
          ac: "تكييف هواء",
          fridge: "ثلاجة",
          tv: "تلفاز",
          washer: "غسالة",
          heater: "سخان",
          lights: "إضاءة",
          other_dev: "أخرى",
          add: "إضافة للشبكة",
          added_devices: "الأجهزة المضافة",
          empty_devices: "لم تقم بإضافة أجهزة.",
          build_dashboard: "تفعيل لوحة التحكم",
          top_consumers_btn: "تحليل الاستهلاك",
          device_name_label: "اسم الجهاز",
          device_brand_label: "الشركة المصنعة",
          device_type_label: "تصنيف الجهاز",
          device_power_label: "القدرة (بالوات)",
          leaderboard_btn: "الترتيب الأسبوعي",
          logout: "خروج",
          eco_impact: "الأثر البيئي",
          co2_saved: "وفر CO2",
          trees_saved: "أشجار",
          eco_mode: "وضع التوفير الذكي (AI)",
          eco_desc: "سيقوم النظام بالتدخل لفصل الأجهزة في أوقات الذروة.",
          activate_ai: "تفعيل الذكاء الاصطناعي",
          report_center: "إصدار التقرير",
          export_report: "تحميل PDF",
          current_consump_month: "الاستهلاك (هذا الشهر)",
          expected_bill: "الفاتورة التقديرية",
          active_devices: "الأجهزة النشطة",
          iot_title: "لوحة التحكم (Live)",
          iot_desc: "جرب فصل أي جهاز.",
          network_active: "متصل",
          chart_line: "منحنى الاستهلاك",
          leaderboard_title: "أبطال التوفير",
          leaderboard_desc: "الأعلى توفيراً هذا الأسبوع.",
          saved_amount: "تم توفيره",
          you: "أنت",
          keep_saving: "استمر في التوفير!",
          back_dash: "العودة للوحة",
          system_optimal: "أداء النظام مثالي",
          efficiency_title: "كفاءة النظام (Efficiency)",
          ai_active_badge: "الذكاء الاصطناعي نشط",
          energy_dist_title: "توزيع استهلاك الطاقة",
          rt_cost_title: "تحليل التكلفة اللحظية",
          daily_cost_est: "التكلفة اليومية (تقديرية)",
          proj_monthly: "المتوقع شهرياً",
          vs_last_month: "2.4% عن الشهر الماضي",
          percent_saved: "-1.2% تم توفيرها",
          analysis_title: "التحليل المفصل",
          top_consumers_title: "الأكثر سحباً للطاقة",
          top_consumers_desc: "قم بإغلاق الأجهزة ذات النسبة العالية.",
          bot_welcome: "أهلاً بك! كيف يمكنني مساعدتك اليوم؟",

          admin_analysis_title: "تحليل المناطق والإنذارات",
          highest_consumption_region: "المنطقة الأكثر استهلاكاً",
          contact_electricity_co: "مراسلة شركة الكهرباء",
          suspected_theft: "اشتباه سرقة تيار",
          high_cons_low_bill: "(استهلاك عالي - فاتورة قليلة)",
          report_theft: "إبلاغ عن سرقة كهرباء",
          technical_check_req: "فحص فني مطلوب",
          low_cons_high_bill: "(استهلاك قليل - فاتورة عالية)",
          report_review: "إبلاغ لمراجعة الفاتورة",

          quick_nav: "القائمة السريعة",
          nav_overview: "نظرة عامة",
          nav_iot: "محاكاة أجهزة IoT",
          nav_forecast: "توقع الاستهلاك",
          nav_reports: "التقارير",
          forecasting_title: "توقع الاستهلاك (Forecasting)",
          forecasting_desc:
            "بناءً على خوارزميات الذكاء الاصطناعي ومعدل سحبك الحالي، الاستهلاك المتوقع للشهر القادم هو:",
          update_forecast: "تحديث التوقعات",
        },
        en: {
          lang_btn: "AR",
          login_title: "User Login",
          login_id_label: "National ID",
          password_label: "Password",
          login_btn: "Login",
          no_account: "No account?",
          create_account: "Create Account",
          create_account_title: "Create WATTO Account",
          full_name_label: "Full Name",
          password_rules_label: "Password (min 6 chars)",
          confirm_pass_label: "Confirm Password",
          region_label: "Region",
          address_label: "Address",
          area_label: "Area (sqm)",
          family_role_label: "Family Role",
          select_option: "Select...",
          father: "Provider",
          mother: "Mother",
          working: "Working",
          not_working: "Not working",
          tier_label: "Current Tier",
          t1: "Tier 1 (0 - 50)",
          t2: "Tier 2 (51 - 100)",
          t3: "Tier 3 (101 - 200)",
          t4: "Tier 4 (201 - 350)",
          t5: "Tier 5 (351 - 650)",
          t6: "Tier 6 (651 - 1000)",
          t7: "Tier 7 (+1000)",
          place_type: "Specify place type:",
          apartment: "Apartment",
          villa: "Villa",
          company: "Company",
          building: "Building",
          other: "Other",
          other_place_label: "Custom Place",
          back_login: "Back to Login",
          continue_meter: "Continue",

          choose_meter_method: "Meter Connection Method",
          method_manual: "Manual Entry",
          method_nfc: "Scan NFC",
          nfc_desc: "Hold your phone near the smart meter to auto-connect",
          manual_desc: "Enter meter data and readings manually",

          manual_meter: "Manual Meter Entry",
          meter_8_label: "Meter Number",
          monthly_cons_label: "Est. Monthly (kWh)",
          meter_photo: "Meter Photo:",
          photo_note: "Updates required every 5 days.",
          verify_continue: "Verify & Continue",
          back_options: "Go Back",
          choose_appliances: "Build Smart Environment",
          appliances_notice: "Add devices with real power (Watt).",
          device_name_label: "Device Name",
          device_brand_label: "Brand / Sponsor",
          device_type_label: "Category",
          device_power_label: "Power (Watt)",
          ac: "AC",
          fridge: "Fridge",
          tv: "TV",
          washer: "Washer",
          heater: "Heater",
          lights: "Lighting",
          other_dev: "Other",
          add: "Add Device",
          added_devices: "Added Devices",
          empty_devices: "No devices yet.",
          build_dashboard: "Activate Dashboard",
          top_consumers_btn: "Analysis",
          leaderboard_btn: "Leaderboard",
          logout: "Logout",
          eco_impact: "Eco Impact",
          co2_saved: "CO2 Saved",
          trees_saved: "Trees",
          eco_mode: "AI Eco Mode",
          eco_desc: "System manages loads during peak times.",
          activate_ai: "Activate AI",
          report_center: "Reports",
          export_report: "Download PDF",
          current_consump_month: "Est. Consumption",
          expected_bill: "Est. Bill",
          active_devices: "Active Devices",
          iot_title: "Device Control (Live)",
          iot_desc: "Turn off devices to see impact.",
          network_active: "Connected",
          chart_line: "Consumption Curve",
          leaderboard_title: "Saving Heroes",
          leaderboard_desc: "Highest savings this week.",
          saved_amount: "Saved",
          you: "You",
          keep_saving: "Keep saving!",
          back_dash: "Back to Dashboard",
          system_optimal: "System Optimal",
          efficiency_title: "System Efficiency",
          ai_active_badge: "AI Eco Mode Active",
          energy_dist_title: "Energy Distribution",
          rt_cost_title: "Real-time Cost Analysis",
          daily_cost_est: "Daily Cost (Est.)",
          proj_monthly: "Projected Monthly",
          vs_last_month: "2.4% vs last month",
          percent_saved: "-1.2% saved",
          analysis_title: "Detailed Analysis",
          top_consumers_title: "Top Consuming Devices",
          top_consumers_desc: "Turn off high-percentage ones.",
          bot_welcome: "Welcome! How can I help?",

          admin_analysis_title: "Region Analysis & Alerts",
          highest_consumption_region: "Highest Consuming Region",
          contact_electricity_co: "Contact Electricity Co.",
          suspected_theft: "Suspected Theft",
          high_cons_low_bill: "(High Cons. - Low Bill)",
          report_theft: "Report Electricity Theft",
          technical_check_req: "Technical Check Required",
          low_cons_high_bill: "(Low Cons. - High Bill)",
          report_review: "Request Bill Review",

          quick_nav: "Quick Menu",
          nav_overview: "Overview",
          nav_iot: "IoT Simulation",
          nav_forecast: "AI Forecasting",
          nav_reports: "Reports",
          forecasting_title: "Consumption Forecasting",
          forecasting_desc:
            "Based on AI algorithms and your current draw, your predicted consumption for next month is:",
          update_forecast: "Update Forecast",
        },
      };

      const dictPh = {
        ar: {
          login_id_ph: "أدخل الرقم القومي",
          password: "••••••••",
          full_name: "الاسم بالكامل",
          national_id: "أدخل 14 رقم",
          confirm_pass: "تأكيد كلمة المرور",
          region: "المنطقة",
          address: "العنوان",
          area: "المساحة",
          other_place_ph: "مثال: مصنع",
          meter_8: "8 أرقام",
          monthly_cons: "مثال: 300",
          device_name_ph: "مثال: تكييف الصالة",
          device_brand_ph: "مثال: سامسونج",
          device_power_ph: "1500",
          type_msg: "اكتب استفسارك...",
        },
        en: {
          login_id_ph: "National ID",
          password: "••••••••",
          full_name: "Full Name",
          national_id: "14 digits",
          confirm_pass: "Confirm Password",
          region: "Region",
          address: "Address",
          area: "Area",
          other_place_ph: "e.g. Factory",
          meter_8: "8 digits",
          monthly_cons: "e.g. 300",
          device_name_ph: "e.g. Living Room AC",
          device_brand_ph: "e.g. Samsung",
          device_power_ph: "1500",
          type_msg: "Type query...",
        },
      };

      function toggleLang() {
        isAr = !isAr;
        document.documentElement.setAttribute("dir", isAr ? "rtl" : "ltr");

        const langBtns = document.querySelectorAll(".lang-toggle-text");
        for (let i = 0; i < langBtns.length; i++) {
          langBtns[i].innerText = isAr ? "EN" : "AR";
        }

        const elementsText = document.querySelectorAll("[data-i18n]");
        for (let i = 0; i < elementsText.length; i++) {
          let key = elementsText[i].getAttribute("data-i18n");
          if (dict[isAr ? "ar" : "en"][key]) {
            elementsText[i].innerText = dict[isAr ? "ar" : "en"][key];
          }
        }

        const elementsPh = document.querySelectorAll("[data-i18n-ph]");
        for (let i = 0; i < elementsPh.length; i++) {
          let key = elementsPh[i].getAttribute("data-i18n-ph");
          if (dictPh[isAr ? "ar" : "en"][key]) {
            elementsPh[i].placeholder = dictPh[isAr ? "ar" : "en"][key];
          }
        }

        const arrows = document.querySelectorAll(".arrow-icon");
        for (let i = 0; i < arrows.length; i++) {
          if (isAr) {
            arrows[i].classList.replace("fa-arrow-right", "fa-arrow-left");
          } else {
            arrows[i].classList.replace("fa-arrow-left", "fa-arrow-right");
          }
        }

        const placeSection = document.getElementById("placeTypeSection");
        if (placeSection) {
          placeSection.style.textAlign = isAr ? "right" : "left";
        }

        initChart();
        updateSystemCalculations();
        buildIoTControls();
      }

      function initNetworkCanvas() {
        const canvas = document.getElementById("canvasNetwork");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let particles = [];

        function resize() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resize);
        resize();

        const icons = ["\uf0eb", "\uf842"];

        for (let i = 0; i < 35; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: Math.random() * 0.8 - 0.4,
            vy: Math.random() * 0.8 - 0.4,
            icon: icons[Math.floor(Math.random() * icons.length)],
            size: Math.random() * 20 + 15,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() * 0.02) - 0.01
          });
        }

        function draw() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const iconColor = "rgba(0, 180, 216, 0.25)";
          
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;

            if (p.x < -50) p.x = canvas.width + 50;
            if (p.x > canvas.width + 50) p.x = -50;
            if (p.y < -50) p.y = canvas.height + 50;
            if (p.y > canvas.height + 50) p.y = -50;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.font = `900 ${p.size}px "Font Awesome 6 Free"`;
            ctx.fillStyle = iconColor;
            ctx.fillText(p.icon, 0, 0);
            ctx.restore();

            for (let j = i + 1; j < particles.length; j++) {
              let p2 = particles[j];
              let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
              if (dist < 200) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                let alpha = 0.15 - dist / 1333;
                ctx.strokeStyle = `rgba(0, 180, 216, ${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }
            }
          }
          requestAnimationFrame(draw);
        }
        
        document.fonts.ready.then(() => {
            draw();
        });
      }
    