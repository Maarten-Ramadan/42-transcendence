import React from 'react';
import { SocketContext } from '../../hooks/useWebsocket';
import './LoadingScreen.css';

const lines = [
  'Calculating the\nfourth dimension',
  'Scanning node_modules\nfolder size',
  'Reaching 88 mph',
  'Looking for\nnorminette updates',
  "Testing GLADoS'\nslow clap processor",
  'Hacking into\nthe mainframe',
  'Finding generic\nloading screen joke',
];

export function LoadingScreen(props: any) {
  const { client, connect, hasConnected, clientError } =
    React.useContext(SocketContext);
  const [loading, setLoading] = React.useState(true);
  const [line, setLine] = React.useState('');
  const [tokenInput, setTokenInput] = React.useState('');
  // show random loading text
  React.useEffect(() => {
    setLine(lines[Math.floor(Math.random() * lines.length)]);
  }, []);

  // connect to socket once user has been requested and is logged in
  React.useEffect(() => {
    if (props.userData.userState.done && props.userData.isLoggedIn && !client) {
      connect();
    }
  }, [props.userData]);

  // show loading screen for at least 2 seconds. so not everything is flashing on load
  React.useEffect(() => {
    const time = setTimeout(() => setLoading(false), 2000);
    return () => {
      clearTimeout(time);
    };
  }, []);

  // error connecting to api
  if ((props.userData.userState.error || clientError) && !loading)
    return (
      <div className="loading-screen">
        <div className="overlay" />
        <div className="login-card">
          <div className="icon" />
          <h1 className="title">Failed to load</h1>
          <p className="text">Click the button below to try again</p>
          <button onClick={() => window.location.reload()} className="button">
            Retry load
          </button>
        </div>
      </div>
    );

  // needs twofactor
  if (props.userData.userState.needsToken && !loading) {
    return (
      <div className="loading-screen">
        <div className="overlay" />
        <div className="login-card">
          <div className="icon" />
          <h1 className="title">Two factor authentication</h1>
          <p className="text">Put in your one time password to login</p>
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <button
            onClick={() => props.userData.sendToken(tokenInput)}
            className="button"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  // not logged in
  if (props.userData.userState.done && !props.userData.isLoggedIn && !loading) {
    return (
      <div className="loading-screen">
        <div className="overlay" />
        <div className="login-card">
          <div className="icon" />
          <h1 className="title">You&apos;re not logged in</h1>
          <p className="text">
            Click the button below to continue to the login page
          </p>
          <a
            href={`${window._env_.VIVID_BASE_URL}/api/v1/auth/login`}
            className="button"
          >
            Log in
          </a>
        </div>
      </div>
    );
  }

  // loading
  if (props.userData.userState.loading || !hasConnected || loading)
    return (
      <div className="loading-screen">
        <div className="overlay" />
        <div className="icon-wrapper">
          <div className="icon" />
          <p className="text">
            {line.split('\n').map((v, i) => (
              <span key={i}>
                {v}
                <br />
              </span>
            ))}
          </p>
        </div>
      </div>
    );

  // not done, shouldnt happen
  if (!props.userData.userState.done || !hasConnected) return null;

  // normal state, render like normal
  return <div>{props.children}</div>;
}
