import React from 'react';
import { ExtendedApplicationContext } from '../interfaces/application-context.interface';
import './styles.css';
interface AppProps {
    context: ExtendedApplicationContext;
}
declare const HippoCMSManager: React.MemoExoticComponent<(props: AppProps) => React.JSX.Element>;
export default HippoCMSManager;
