import styles from '@/styles/loading.module.css';

export function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center text-center">
      <div className="content">
        <div className="mb-6 block">
          <img src="" className="vscode-icon" />
        </div>
        <h1 className="title text-3xl m-[0_0_12px]">
          Launching <span className="app-name">Visual Studio Code</span>
        </h1>
        <div className="message">
          <div className="success-message">
            <p className="subtitle text-lg opacity-70 m-[0_0_36px]">You will be redirected in a few moments.</p>
            <p className="detail">
              If nothing happens,{' '}
              <a
                href="https://vscode.dev/redirect?url=vscode%3A%2F%2Fvscode.github-authentication%2Fdid-authenticate%3Fnonce%3D7f5c98a854c75a73%26windowId%3D3"
                id="fallback-link"
              >
                open this link in your browser
              </a>
              .
            </p>
          </div>
          <div className="error-message">
            <p className="subtitle">An error occurred while signing in:</p>
            <div className="detail" />
          </div>
        </div>
      </div>
    </div>
  );
}
