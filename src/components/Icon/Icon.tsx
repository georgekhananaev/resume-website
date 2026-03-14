import {ReactNode} from 'react';

export interface IconProps extends React.HTMLAttributes<SVGSVGElement> {
    svgRef?: React.Ref<SVGSVGElement>;
    transform?: string;
    children?: ReactNode;
}

export default function Icon({children, className, svgRef, transform, ...props}: IconProps) {
    return (
        <svg
            className={className}
            fill="currentColor"
            ref={svgRef}
            transform={transform}
            viewBox="0 0 128 128"
            width="128"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            {children}
        </svg>
    );
}
