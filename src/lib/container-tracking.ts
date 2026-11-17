export const containerStages = {
  loaded: "The container has been loaded",
  sea: "The container is on the high sea",
  clearing: "The container is being cleared",
  offloading: "The container is being offloaded",
  offloaded: "The container has been offloaded",
} as const;

const day = 86_400_000;
function utcDay(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function containerStage(loadedAt: Date, arrival: Date, now = new Date()) {
  const elapsed = Math.floor((utcDay(now) - utcDay(loadedAt)) / day);
  const arrivalDay = utcDay(arrival);
  const today = utcDay(now);
  if (today > arrivalDay) return containerStages.offloaded;
  if (today === arrivalDay) return containerStages.offloading;
  if (elapsed < 3) return containerStages.loaded;
  if (elapsed < 33) return containerStages.sea;
  return containerStages.clearing;
}

export function containerTimeline(loadedAt: Date, arrival: Date, now = new Date()) {
  const loadedDay = utcDay(loadedAt);
  const arrivalDay = utcDay(arrival);
  const today = utcDay(now);
  return [
    { status: containerStages.loaded, at: loadedDay },
    { status: containerStages.sea, at: loadedDay + 3 * day },
    { status: containerStages.clearing, at: loadedDay + 33 * day },
    { status: containerStages.offloading, at: arrivalDay },
    { status: containerStages.offloaded, at: arrivalDay + day },
  ]
    .filter((item) => item.at <= today)
    .map((item) => ({
      status: item.status,
      note: "Estimated stage based on the shipping schedule.",
      occurredAt: new Date(item.at).toISOString(),
    }));
}
