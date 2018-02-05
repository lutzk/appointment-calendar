import React from 'react'

const TabContent = ({ tab, activeTab, users, rentals, loading }) => {
    const isTabActive = tab === activeTab;
    const empty = !users && !rentals;
    let data
    if (rentals) {
        data = rentals
    }
    else if (users) {
        data = users
    }

    const usersBox = d => (
        <div key={d.surName + d.id} className='tabContentItem'>
            <div>
                Id: <span className='value'>{d.id}</span>
            </div>
            <div>
                Firstname: <span className='value'>{d.firstName}</span>
            </div>
            <div>
                Lastname: <span className='value'>{d.surname}</span>
            </div>
            <div>
                Email: <span className='value'>{d.email}</span>
          </div>
        </div>);

    const rentalsBox = d => (
        <div key={d.area + d.id} className='tabContentItem'>
            <div>
                Id: <span className='value'>{d.id}</span>
            </div>
            <div>
                Area: <span className='value'>{d.area}</span>
            </div>
            <div>
                NumOfRooms: <span className='value'>{d.numberRooms}</span>
            </div>
            <div>
                Views: <span className='value'>{d.views}</span>
            </div>
            {d.address && <div>
                <div><span className='value'>ADRESS:</span></div>
                <div>City: <span className='value'>{d.address.city}</span></div>
                <div>House Number: <span className='value'>{d.address.houseNumber}</span></div>
                <div>Street: <span className='value'>{d.address.street}</span></div>
                <div>Zip Code: <span className='value'>{d.address.zipCode}</span></div>
            </div>}
    </div>);

    if (isTabActive && !empty) {
        return (
            <div className={`tabContentWrap ${isTabActive ? 'active' : ''}`}>
                <div className='tabContent'>
                  {data &&
                    data.length && (
                      <div className='tabContentScroller'>
                        {data.map(d => {
                          if (rentals) {
                            return rentalsBox(d)
                          }
                            else if (users) {
                            return usersBox(d)
                          }
                        })}
                      </div>
                    )}
                  {!data || (!data.length && <div>no data here</div>)}
                </div>
            </div>
          )
    } else if (empty) {
        return (
            <div className="tabContentWrap active">
                <div className='tabContent'>
                I am empty - try to activate a tab
                {loading && <div>Loading data ...</div>}
            </div></div>
        )
    }

    return null;
}

export default TabContent
