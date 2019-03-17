import React from "react";

import Stream from "./Stream";

const Streams = ({ streams }) => {
	const streamList = streams.length>0 ? (
		streams.map(stream => {
			return (
				<div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={ stream.id }>
						<Stream stream={ stream }/>
				</div>
			)
		})
	) : (
		<div className="col-12">
			<div align="center">No streams</div>
		</div>
	)

  return (
    <div className="Streams">
			<div className="row">
      	{ streamList }
			</div>
    </div>
  );
}

export default Streams;
