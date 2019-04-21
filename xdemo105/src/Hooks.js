import React, { useState, useEffect } from 'react';

const Hooks = () => {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    // if (stars === -1) return;

    fetch('https://api.github.com/repos/996icu/996.ICU')
      .then(x => x.json())
      .then(x => setStars(x.stargazers_count));
  });

  return (
    <div>
      996.ICU Got <b>{stars}</b> Stars
      <button onClick={() => setStars(-1)}>reset</button>
    </div>
  );
};

export default Hooks;
