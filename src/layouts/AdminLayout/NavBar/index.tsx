import { useContext } from 'react';

// project imports
import NavRight from './NavRight';
import { ConfigContext } from '@/contexts/ConfigContext';
import * as actionType from '@/store/actions';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NavBar() {
  const configContext = useContext(ConfigContext);
  const { headerBackColor, collapseTabMenu, collapseHeaderMenu, collapseMenu } = configContext.state;
  const { dispatch } = configContext;

  const navToggleHandler = () => {
    dispatch({ type: actionType.COLLAPSE_MENU });
  };

  let headerClass = ['pc-header', headerBackColor];
  if (collapseHeaderMenu) {
    headerClass = [...headerClass, 'mob-header-active'];
  }

  let mobDrpClass = ['me-auto pc-mob-drp t'];
  if (collapseTabMenu) {
    mobDrpClass = [...mobDrpClass, 'mob-drp-active'];
  }

  let navBar = (
    <>
      <div className="header-wrapper" style={{ backgroundColor: "#111", borderBottom: "1px solid #ffffff2f", display: 'flex', alignItems: 'center', paddingLeft: '16px' }}>
        <Button variant="ghost" size="icon" onClick={navToggleHandler} className="text-white hover:bg-white/10 mr-4">
             <Menu />
        </Button>
        <div className="ms-auto">
          <NavRight />
        </div>
      </div>
      {(collapseTabMenu || collapseHeaderMenu) && <div className="pc-md-overlay" />}
    </>
  );

  return <header className={headerClass.join(' ')}>{navBar}</header>;
}
