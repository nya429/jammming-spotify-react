import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {
    constructor(props) {
      super(props);
      this.onNext = this.onNext.bind(this);
      this.onPrev = this.onPrev.bind(this);
      this.onPage = this.onPage.bind(this);
    }

    onNext(e) {
        e.preventDefault();
        this.props.onPage(this.props.searchResults.next);
    }

    onPrev(e) {
        e.preventDefault();
        this.props.onPage(this.props.searchResults.previous);
    }

    onPage(index)  {
      let url = this.props.searchResults.href.replace(/(offset=)([^&]*)/, '$1' + (index-1)*this.props.searchResults.limit);
      console.log(url);
      this.props.onPage(url);
    }

    renderPage(searchResults) {
      console.log(!searchResults.total);
      if(!searchResults.total) {
        return;
      }
      if(searchResults.total === 0) {
        console.log('here')
        return <h3> {searchResults.offset + 1} - {searchResults.offset + searchResults.limit > searchResults.total ? searchResults.total : searchResults.offset + searchResults.limit} of {searchResults.total} Track</h3>;
      }
      let pace = 2;
      let page = searchResults.offset/searchResults.limit + 1;
      let totalPage = Math.ceil(searchResults.total/searchResults.limit);
      let minPage = (page - pace) < 1 ? 1 : page - pace;
      let maxPage = (page + pace) > totalPage ? totalPage : page + pace;
      let pages = [];
      for(let index = minPage; index <= maxPage; index++) {
          pages.push( index === page ? <td key={index} className= "currentPage" >{index}</td> :
            <td key={index} onClick={(e) => this.onPage(index)} className="page" >{index}</td>
        )
      }
      return (<div className='pagging'>
                <h3> {searchResults.offset + 1} - {searchResults.offset + searchResults.limit > searchResults.total ? searchResults.total : searchResults.offset + searchResults.limit} of {searchResults.total} Track</h3>
                <table>
                  <tbody>
                    <tr>
                    {this.props.searchResults.previous && <td className="page" onClick={this.onPrev}>&lt;</td>}
                    {pages}
                    {this.props.searchResults.next && <td className="page" onClick={this.onNext}>&gt;</td>}
                    </tr>
                  </tbody>
                </table>
            </div>);
    }

    render() {
    return (
                <div className="SearchResults">
                      <div className="header-cont">
                          <h2>Results</h2>
                          {this.renderPage(this.props.searchResults)}
                      </div>
                        <div className="SearchResultsList">
                        <TrackList
                        isRemoval={false} onMouseOver={this.props.onMouseOver} onAdd={this.props.onAdd} tracks={this.props.searchResults.tracks}/>
                        </div>
                      </div>

            );
          }

}

export default SearchResults;
