import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {
  render() {
    console.log("searchResults");
    console.log(this.props.searchResults);
    return (
                <div className="SearchResults">
                      <h2>Results</h2>
                      <TrackList
                        toggleRemoval={this.toggleRemoval}  isRemoval={false} onChange={this.props.onChange} tracks={this.props.searchResults}/>
                      </div>

            );
          }

}

export default SearchResults;
