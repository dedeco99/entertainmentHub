import React from "react";

import Channel from "./Channel";

const Channels = ({ channels }) => {
	const channelList = channels.length>0 ? (
		channels.map(channel => {
			return (
				<div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={ channel.id }>
						<Channel channel={ channel }/>
				</div>
			)
		})
	) : (
		<div className="col-12">
			<div align="center">No channels</div>
		</div>
	)

  return (
    <div className="Channels">
			<div className="row">
      	{ channelList }
			</div>
    </div>
  );
}

export default Channels;
