const TIME_TO_EXPLODE = 60 * 1000;
const timebombMap = {};

function setup(telegram) {
  return function delayTimebomb(chat) {
    if (timebombMap[chat.id]) {
      clearTimeout(timebombMap[chat.id]);
    }

    const timeoutId = setTimeout(async () => {
      // rage
      telegram.sendMessage(chat.id, 'Hi, are you still there?');

      await timeout(1000);
      if (hasCancelled()) return;

      telegram.sendMessage(chat.id, 'Talk to me ley...');

      await timeout(1500);
      if (hasCancelled()) return;

      telegram.sendMessage(chat.id, 'I miss you');

      await timeout(2000);
      if (hasCancelled()) return;

      telegram.sendMessage(chat.id, "Let's be super silly together");
      telegram.sendSticker(chat.id, 'CAADBQAD0gEAAhfZqwPNOf2akSY2gwI');

      function hasCancelled() {
        return timeoutId !== timebombMap[chat.id];
      }
    }, TIME_TO_EXPLODE);

    timebombMap[chat.id] = timeoutId;
  };
}

function timeout(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

module.exports = setup;
