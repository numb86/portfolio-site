import styles from './use-language.module.css';

function LanguageColor({color}: {color: string}) {
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: color,
        width: '16px',
        height: '16px',
        borderRadius: '50%',
      }}
    />
  );
}

export function UsedLanguage({
  color,
  name,
}: React.ComponentProps<typeof LanguageColor> & {name: string}) {
  return (
    <div className={styles.container}>
      <LanguageColor color={color} />
      <span className={styles.name}>{name}</span>
    </div>
  );
}
