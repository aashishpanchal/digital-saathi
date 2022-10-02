import { Link as RouterLink } from "react-router-dom";
import Link, { LinkProps } from "@mui/material/Link";

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
);

export default LinkRouter;
