import React from "react";
import ReactDOM from 'react-dom/client';

interface PortalProps {
	onOk?: (...params: any[]) => any;
	onCancel?: (...params: any[]) => any;
}

function createPortal<T extends PortalProps>(Comp: React.FC<T>) {
    let hasMounted = false;
    return (props: T) => {
		
        const { onCancel: originCancel, onOk: originOk, ...rest } = props;
        const container = document.createElement('div');
        const root = ReactDOM.createRoot(container);

        const destroyed = () => {
            if (!hasMounted) return;
            hasMounted = false;
            root.unmount();
            document.body.removeChild(container);
        };

        const mount = () => {
            if (hasMounted) return;
            root.render(
                <Comp { ...rest } onCancel={ onCancel } onOk={ onOk } />
            );
            hasMounted = true;
            document.body.appendChild(container);
        };
		
        const onCancel: T['onCancel'] = async(...args) => {
            await originCancel?.(...args);
            destroyed();
        };
        const onOk: T['onOk'] = async(...args) => {
            await originOk?.(...args);
            destroyed();
        };

        mount();

        return {
            destroyed
        };
    };
}

export default createPortal;