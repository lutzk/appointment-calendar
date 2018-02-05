import React from 'react'
import TabContent from './TabContent'

const Tabs = ({
  activeTab, users, rentals, selectTab, loading
}) => (
  <div className='tabsWrap'>
    <ul className='tabsNav'>
      <li
        onClick={() => selectTab('Rentals')}
        className={`tabsNavItem ${activeTab === 'Rentals' ? 'active' : ''}`}
      >
        Rentals
      </li>
      <li
        onClick={() => selectTab('Data')}
        className={`tabsNavItem ${activeTab === 'Data' ? 'active' : ''}`}
      >
        Users
      </li>
    </ul>
    <TabContent tab='Rentals' activeTab={activeTab} rentals={rentals} />
    <TabContent tab='Data' activeTab={activeTab} users={users} />
    <TabContent loading={loading} />
  </div>
)

export default Tabs
