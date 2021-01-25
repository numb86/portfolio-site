import styles from '../../styles/utils.module.css';
import blogEntryStyles from './blog-entry.module.css';

export type BlogEntry = {
  url: string;
  title: string;
  summary: string;
  published: string;
  thumbnailUrl: string;
};

type Props = BlogEntry;

export function BlogEntryComponent({
  url,
  title,
  summary,
  published,
  thumbnailUrl,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.card_inner}>
        <div className={blogEntryStyles.entry}>
          <a href={url} target="_blank" rel="noreferrer">
            <div className={blogEntryStyles.thumbnail_container}>
              <img src={thumbnailUrl} alt={title} width="300px" />
            </div>

            <p className={blogEntryStyles.published}>{published}</p>
            <p className={blogEntryStyles.title}>{title}</p>
            <p className={blogEntryStyles.summary}>{summary}</p>
          </a>
        </div>
      </div>
    </div>
  );
}
