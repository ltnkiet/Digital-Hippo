  import React from "react";
  import useBreadcrumbs from "use-react-router-breadcrumbs";
  import { Link } from "react-router-dom";
  import { IoIosArrowForward } from "asset/icons";

  const Breadcrumbs = ({ title, category, product }) => {
    const routes = [
      { path: "/", breadcrumb: "TRANG CHỦ" },
      { path: `/${product}`, breadcrumb: "SẢN PHẨM" },
      { path: `/${product}/:pid/:title`, breadcrumb: title },
      { path: "/:category", breadcrumb: category },
      { path: "/:category/:pid/:title", breadcrumb: title },
    ];
    const breadcrumbs = useBreadcrumbs(routes);
    return (
      <div className="text-sm text-textColor flex items-center">
        {breadcrumbs
          ?.filter((el) => !el.match.route === false)
          .map(({ match, breadcrumb }, index, self) => (
            <Link className="flex items-center uppercase hover:text-main gap-1" key={match.pathname} to={match.pathname}>
              <span>{breadcrumb}</span>
              {index !== self.length - 1 && <IoIosArrowForward className="font-medium"/>}
              <span>{""}</span>
            </Link>
          ))}
      </div>
    );
  };

  export default Breadcrumbs;
