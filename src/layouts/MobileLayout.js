import React, { PureComponent } from 'react';
import NProgress from 'nprogress';
import withRouter from 'umi/withRouter';
// import Authorized from '@/utils/Authorized';
// import Exception403 from '../pages/Exception/403';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import '@/layouts/nprogress.less';
import router from 'umi/router';
import { getUrlParamReg } from '../utils/utils';

NProgress.configure({ showSpinner: false });

let currHref = '';

@connect(({ dynamicsList }) => ({
  dynamicsList,
}))
class MobileLayout extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/inquireCurrentAccountInfo'
    })
    this.getAuthority();
  }

  getAuthority = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dynamicsList/inquireOperationCodeListByProductAccount',
      payload: {
        productCode: 'YX_WISDOM-TEACHER_MOMENT_APP',
      }
    })
  }

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  render() {
    const {
      children,
      loading,
      location: { pathname },
      route: { routes },
    } = this.props;
    const routerConfig = this.getRouterAuthority(pathname, routes);
    const { href } = window.location;
    if (currHref !== href) {
      NProgress.start();
      if (!loading.global) {
        NProgress.done();
        currHref = href;
      }
    }

    return (
      <div key={pathname} style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {/*<Authorized authority={routerConfig} noMatch={<Exception403 />}>*/}
        {/*</Authorized>*/}
        {children}
      </div>
    );
  }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(MobileLayout));
