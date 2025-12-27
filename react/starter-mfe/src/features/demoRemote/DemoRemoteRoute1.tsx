import { Link } from 'react-router';
import {
  remoteSiblingPath,
  routePaths,
} from '../../core/constants/routePaths';
import { useHostProps } from './HostPropsContext';
import styles from './DemoRemoteRoute1.module.scss';

/**
 * Sample remote content for Route 1.
 * Shows optional host `title` when embedded via host props.
 * Sibling links stay relative so nested shell→hybrid→leaf URLs keep their prefix.
 */
export function DemoRemoteRoute1() {
  const { title } = useHostProps();
  const showHostTitle = Boolean(title);

  return (
    <div className={styles.panel} data-testid="demo-remote-route-1">
      <h1 className={styles.title}>Route 1</h1>
      {showHostTitle ? (
        <p className={styles.hostTitle} data-testid="demo-remote-host-title">
          {title}
        </p>
      ) : null}
      <p className={styles.copy}>
        Sample remote page. This is the default entry when the remote runs on
        its own or is loaded into a host panel.
      </p>
      <p className={styles.nav}>
        <Link
          to={remoteSiblingPath(routePaths.remote.route2)}
          data-testid="demo-remote-to-route-2"
        >
          Go to Route 2
        </Link>
      </p>
    </div>
  );
}
