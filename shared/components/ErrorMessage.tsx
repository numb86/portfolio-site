import styles from './error-message.module.css';

export function ErrorMessage({error}: {error: Error}) {
  const message = JSON.parse(error.message);
  return (
    <div className={styles.container}>
      <h2>{message.statusCode} Error</h2>
      <p>{message.error}</p>
    </div>
  );
}
