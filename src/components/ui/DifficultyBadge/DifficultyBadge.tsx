import styles from './DifficultyBadge.module.css';

const icons = { beginner: '🟢', intermediate: '🟡', advanced: '🔴' };

interface DifficultyBadgeProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  label: string;
}

export default function DifficultyBadge({ level, label }: DifficultyBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[level]}`}>
      {icons[level]} {label}
    </span>
  );
}
