import React from "react";
import { thumbSourceLink } from "../../utilities";

function KnowMoreTab({ results, specificDate }) {
  return (
    <div className="explanation-tab">
      {results.map((result, idx) => {
        const imgSrc = `https://apod.nasa.gov/apod/calendar/${thumbSourceLink(
          result.date
        )}`;

        return (
          <div key={idx}>
            <img
              alt="Thumb"
              onClick={() => specificDate(result.date)}
              src={imgSrc}
            />
            <p>{result.title}</p>
          </div>
        );
      })}
    </div>
  );
}

export default KnowMoreTab;
