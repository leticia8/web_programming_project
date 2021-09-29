import { directive } from 'https://unpkg.com/lit-html?module';

const resolvePromise = directive(
  (promise, pending = 'Loading...') => (part) => {
    part.setValue(pending);

    Promise.resolve(promise).then((resolvedValue) => {
      part.setValue(resolvedValue);
      part.commit();
    });
  },
);

export default resolvePromise;
