import classNames from "classnames";

import "@vscode/codicons/dist/codicon.css";

type Props = {
    icon: CodIconName
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

const CodIcon = ({ icon, className, ...otherProps }: Props) => {
    return <i className={classNames("codicon", "codicon-" + icon, className)} {...otherProps}></i>;
}

export default CodIcon;