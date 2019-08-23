import React from "react";

export function SunLoader() {
  const bigRayCount = 12;
  const littleRayCount = 8;

  function buildRays(num) {
    const rays = [];

    for (let i = 0; i < num; i++) {
      rays.push(<div class="ray" />);
    }

    return rays;
  }

  return (
    <div class="sun-container">
      <div class="rays-big" id="big-rays">
        {buildRays(bigRayCount)}
      </div>
      <div class="rays-small" id="small-rays">
        {buildRays(littleRayCount)}
      </div>
      <div class="sun-light" />
    </div>
  );
}

export function MoonLoader() {
  return (
    <div class="moon-container">
      <div class="mask-left">
        <div class="moon shade-to-light" />
        <div class="moon light-to-shade" />
      </div>

      <div class="mask-right">
        <div class="moon shade-to-light" />
        <div class="moon light-to-shade" />
      </div>
    </div>
  );
}

export function TitleLoader() {
  return (
    <div class="load-title">
      <div class="title-container">
        <h1 class="apod-name">APOD</h1>
        <p>By The Trav</p>
      </div>
    </div>
  );
}
