import styles from "./UnsupportedSection.module.css";

interface UnsupportedSectionProps {
  type: string;
  id: string;
}

export default function UnsupportedSection({ type, id }: UnsupportedSectionProps) {
  return (
    <div className={styles.unsupported} role="alert">
      <div className={styles.icon}>⚠️</div>
      <h3 className={styles.title}>Unsupported Section</h3>
      <p className={styles.message}>
        Section type &ldquo;{type}&rdquo; (ID: {id}) is not recognized by the renderer.
      </p>
    </div>
  );
}
