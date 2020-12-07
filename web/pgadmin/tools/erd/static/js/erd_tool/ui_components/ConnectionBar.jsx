import React from 'react';

export const STATUS = {
  CONNECTED: 1,
  DISCONNECTED: 2,
  CONNECTING: 3,
}

export default function ConnectionBar({statusId, status, bgcolor, fgcolor, title}) {
  return (
    <div className="connection_status_wrapper d-flex">
      {/* <div id={statusId}
        role="status"
        className="connection_status d-flex justify-content-center align-items-center" data-container="body"
        data-toggle="popover" data-placement="bottom"
        data-content=""
        data-panel-visible="visible"
        tabIndex="0">
        <span className={'pg-font-icon d-flex m-auto '
            + (status == STATUS.CONNECTED ? 'icon-query-tool-connected' : '')
            + (status == STATUS.DISCONNECTED ? 'icon-query-tool-disconnected ' : '')
            + (status == STATUS.CONNECTING ? 'obtaining-conn' : '')}
          aria-hidden="true" title="" role="img">
        </span>
      </div> */}
      <div className="connection-info btn-group" role="group" aria-label="">
        <div className="editor-title"
          style={{backgroundColor: bgcolor, color: fgcolor}}>
            {status == STATUS.CONNECTING ? '(Obtaining connection...) ' : ''}{title}
        </div>
      </div>
    </div>
  )
}
