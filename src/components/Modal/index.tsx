import { Modal } from "antd"
import { ReactNode } from "react"
import createPortal from "./createPortal"
import './index.less'

interface BaseModalProps {
	onOk?: () => void
	onCancel?: () => void
	content?: ReactNode | 'string'
}

let bg = 'https://kdzs-xcx-front.oss-cn-zhangjiakou.aliyuncs.com/knhd/images/弹窗底图.png' 
export const setModalBg = (url: string) => bg = url

const BaseModal = (props: BaseModalProps) => {
	const { onOk, content, ...rest } = props;

    return (
        <Modal
            open
            title=""
            onOk={ () => {
                props.onOk?.();
            } }
            centered
						width={500}
						closeIcon={null}
            maskClosable={ false }
            footer={ null }
            wrapClassName="z-99999 zModal"
						{...rest}
        >
						<div
							className="relative bg-contain bg-no-repeat rounded-22"
							style={{ backgroundImage: `url(${bg})`}}
						>
							{props.content}
						</div>
        </Modal>
    );
};



export default createPortal<BaseModalProps>(BaseModal);
