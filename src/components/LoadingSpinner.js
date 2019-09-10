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
    <div className="apod__loading">
      <div class="sun-container">
        <div class="rays-big" id="big-rays">
          {buildRays(bigRayCount)}
        </div>
        <div class="rays-small" id="small-rays">
          {buildRays(littleRayCount)}
        </div>
        <div class="sun-light" />
      </div>
    </div>
  );
}

export function MoonLoader() {
  return (
    <div className="apod__loading">
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
    </div>
  );
}

export function TitleLoader({ isLoading }) {
  return (
    isLoading && (
      <div class="load-title">
        <div class="title-container">
          <div className="loader">
            <SunLoader />
          </div>
          <div className="title">
            <h1 class="apod-name">APOD</h1>
          </div>
        </div>
      </div>
    )
  );
}
