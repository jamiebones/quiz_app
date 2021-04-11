import React from "react"

const NotAuthorizedComponent = ( { requestedPage }) => {
    return <div className="row">
       <div className="col-md-12">

           <p>
               No Authorized to view the requested page {requestedPage}
           </p>
       </div>

    </div>
}


export default NotAuthorizedComponent;