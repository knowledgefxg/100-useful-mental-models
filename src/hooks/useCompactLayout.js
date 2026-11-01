import { useEffect, useState } from 'react';

export default function useCompactLayout() {
  // Null during prerendering and hydration; the effect fills in the real layout.
  const [compact, setCompact] = useState(null);
  useEffect(() => {
    const media = matchMedia('(max-width: 1180px)');
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return compact;
}
