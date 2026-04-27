const navRight = document.querySelector("#nav-right");
const page = window.location.pathname;

if (page.includes("track.html")) {
  navRight.innerHTML = `
        <div class="date">
            <select id="month" name="month">
                <option selected disabled>Month</option>
                <option value="jan">Jan</option>
                <option value="feb">Feb</option>
                <option value="mar">Mar</option>
                <option value="apr">Apr</option>
                <option value="may">May</option>
                <option value="jun">Jun</option>
                <option value="jul">Jul</option>
                <option value="aug">Aug</option>
                <option value="sep">Sep</option>
                <option value="oct">Oct</option>
                <option value="nov">Nov</option>
                <option value="dec">Dec</option>
            </select>
            <select id="year" name="year"></select>
        </div>
    `;

  const yearSel = document.querySelector("#year");
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 1; y <= currentYear + 1; y++) {
    yearSel.innerHTML += `<option ${y === currentYear ? "selected" : ""} value="${y}">${y}</option>`;
  }

  document.querySelector("#month").addEventListener("change", function () {
    document.querySelector("#heading").textContent = `Total Expenses (${this.value})`;
  });

} else {
  navRight.innerHTML = `
        <div id="sign">
            <a href="track.html">Get Started</a>
        </div>
    `;
}