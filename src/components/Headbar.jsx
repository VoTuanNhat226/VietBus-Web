import {usePageTitle} from "../context/PageTitleContext.jsx";

const Headbar = ({collapsed}) => {
    const {title, headerAction} = usePageTitle();
    return (
        <div
            className="fixed top-0 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-50 transition-all duration-300"
            style={{left: collapsed ? "4rem" : "15rem"}}
        >
            <h1 className="text-2xl font-semibold text-gray-800 mb-0">{title}</h1>
            {headerAction && <div>{headerAction}</div>}
        </div>
    );
};

export default Headbar;