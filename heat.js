(function () {
  const screen = document.querySelector(".screen");
  const label = document.querySelector(".heat strong");
  if (!screen || !label) return;

  const STATES = [
    { min: 0, name: "freezing", label: "Freezing" },
    { min: 1, name: "cold", label: "Cold" },
    { min: 2, name: "warm", label: "Warm" },
    { min: 4, name: "hot", label: "Hot" },
  ];

  const orbs = Array.from(document.querySelectorAll(".heat-orb"));

  function value(selector) {
    const el = document.querySelector(selector);
    return el && el.value ? el.value.trim() : "";
  }

  function calcScore() {
    let score = 0;
    if (value("#make-input")) score++;
    if (value("#model-input")) score++;
    if (value("#year-input")) score++;
    if (value("#hull-number")) score++;
    return score;
  }

  function resolveState(score) {
    let active = STATES[0];
    for (const state of STATES) {
      if (score >= state.min) active = state;
    }
    return active;
  }

  let currentName = null;
  let currentOrbCount = -1;
  function apply() {
    const score = calcScore();
    const state = resolveState(score);
    if (state.name !== currentName) {
      currentName = state.name;
      STATES.forEach((s) => screen.classList.remove(`heat-${s.name}`));
      screen.classList.add(`heat-${state.name}`);
      label.textContent = state.label;
    }
    const orbCount = score < 2 ? 0 : Math.min(orbs.length, (score - 1) * 2);
    if (orbCount !== currentOrbCount) {
      currentOrbCount = orbCount;
      orbs.forEach((orb, i) => {
        orb.classList.toggle("is-visible", i < orbCount);
      });
    }
  }

  let pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      apply();
    });
  }

  document.addEventListener("input", schedule);
  document.addEventListener("change", schedule);
  document.addEventListener("click", schedule);

  apply();
})();
