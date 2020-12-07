import React, { forwardRef } from 'react';
import Tippy from '@tippyjs/react';
import {isMac} from 'sources/keyboard_shortcuts';

const BaseIconButton = forwardRef((props, ref)=>{
  const {icon, text, className, ...otherProps} = props;

  return(
    <button ref={ref} className={className} {...otherProps}>
      {icon && <span className={`${icon} sql-icon-lg`} aria-hidden="true" role="img"></span>}
      {text && <span className="text-icon">{text}</span>}
    </button>
  );
});

export function Shortcut({shortcut}) {
  let keys = [];
  shortcut.alt && keys.push((isMac() ? 'Option' : 'Alt'));
  shortcut.control && keys.push('Ctrl');
  shortcut.shift && keys.push('Shift');
  keys.push(shortcut.key.char.toUpperCase());
  return (
    <div style={{justifyContent: 'center', marginTop: '0.125rem'}} className="d-flex">
      {keys.map((key, i)=>{
        return <div key={i} className="shortcut-key">{key}</div>
      })}
    </div>
  )
}

export const IconButton = forwardRef((props, ref) => {
  const {title, shortcut, className, ...otherProps} = props;

  if (title) {
    return (
      <Tippy content={
        <>
          {title && <div style={{textAlign: 'center'}}>{title}</div>}
          {shortcut && <Shortcut shortcut={shortcut} />}
        </>
      }>
        <BaseIconButton ref={ref} className={'btn btn-sm btn-primary-icon ' + (className || '')} {...otherProps}/>
      </Tippy>
    );
  } else {
    return <BaseIconButton ref={ref} className='btn btn-sm btn-primary-icon' {...otherProps}/>
  }
});

export function DetailsToggleButton({showDetails, ...props}) {
  return (
    <IconButton
      icon={showDetails ? "far fa-eye" : "fas fa-low-vision"}
      title={showDetails ? "Show less details" : "Show more details" }
      {...props} />
  );
}

export function ButtonGroup({className, children}) {
  return (
    <div className={"btn-group mr-1 " + (className ? className : '')} role="group" aria-label="save group">
      {children}
    </div>
  )
}

export default function ToolBar({id, children}) {
  return (
    <div id={id} className="editor-toolbar d-flex" role="toolbar" aria-label="">
      {children}
    </div>
  )
}
