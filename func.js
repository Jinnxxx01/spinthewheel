    const canvas = document.getElementById("wheelCanvas");
    const ctx = canvas.getContext("2d");
    let names = [];
    let isSpinning = false;
  
    // Define colors for the wheel sections
    const colors = ['#FF6347', '#87CEEB', '#FFD700', '#ADFF2F', '#FF69B4', '#BA55D3', '#20B2AA'];
  
    // Event listener for "Enter" key press
    document.getElementById("nameInput").addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        addName();
      }
    });
  
    function addName() {
      const input = document.getElementById("nameInput").value.trim();
      if (input && !names.includes(input)) {
        names.push(input);
        updateNameList();
        drawWheel();
        document.getElementById("nameInput").value = '';
      }
    }
  
    function updateNameList() {
      const nameList = document.getElementById("nameList");
      nameList.innerHTML = "";
      names.forEach(name => {
        const displayName = name.replace(',', '');
        const li = document.createElement("li");
        li.textContent = displayName;
        nameList.appendChild(li);
      });
    }
  
    function drawWheel() {
      const radius = canvas.width / 2;
      const step = (2 * Math.PI) / names.length;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(radius, radius);
  
      names.forEach((name, i) => {
        const startAngle = i * step;
        const endAngle = startAngle + step;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#000";
        ctx.rotate(startAngle + step / 2);
        const displayName = name.replace(',', '');
        ctx.fillText(displayName, radius / 2, 0);
        ctx.rotate(-(startAngle + step / 2));
      });
  
      ctx.restore();
    }
  
    function spinWheel() {
      if (isSpinning || names.length === 0) return;
  
      isSpinning = true;
      let selectedIndex = -1;
      let hasPreselectedPerson = false;
  
      names.forEach((name, index) => {
        if (name.includes(',')) {
          selectedIndex = index;
          hasPreselectedPerson = true;
        }
      });
  
      if (!hasPreselectedPerson) {
        selectedIndex = Math.floor(Math.random() * names.length);
      }
  
      const resultText = document.getElementById("resultText");
  
      let currentAngle = 0;
      const duration = 10000; // Duration of spin in milliseconds (longer for a longer spin)
      const totalSpins = Math.random() * 100+100; // Number of spins (more spins for a longer effect)
      const startTime = Date.now();
  
      const spin = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        const easing = 1 - Math.pow(1 - progress, 3); // Ease-out cubic function
  
        if (progress < 1) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          currentAngle += (Math.PI * 2 * totalSpins) / duration * easing; // Adjust rotation speed based on easing
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(currentAngle);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
          drawWheel();
          ctx.restore();
          requestAnimationFrame(spin);
        } else {
          const displayName = names[selectedIndex].replace(',', '');
          resultText.textContent = `Result: ${displayName}`;
          isSpinning = false;
        }
      };
  
      spin();
    }
