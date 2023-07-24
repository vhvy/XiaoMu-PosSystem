import classNames from "classnames";

import "@vscode/codicons/dist/codicon.css";
import { CSSProperties } from "react";

type Props = {
    icon: CodIconName
    size?: number,
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

const CodIcon = ({ icon, className, size, ...otherProps }: Props) => {
    const style: CSSProperties = {};
    if (size) style.fontSize = size + "px";
    return <i className={classNames("codicon", "codicon-" + icon, className)} style={style} {...otherProps}></i>;
}

export default CodIcon;