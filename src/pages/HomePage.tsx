import { ClipsSection } from '../layouts/ClipsSection';
import { GamesSection } from '../layouts/GamesSection';
import { GroupsSection } from '../layouts/GroupsSection';
import { ProfileSection } from '../layouts/ProfileSection';
import { UploadSection } from '../layouts/UploadSection';
import { UsersSection } from '../layouts/UsersSection';
import { SearchBar } from '../components/SearchBarComponent';
import { FilterButton } from '../components/FilterButtonComponent';
import '../css/home.css';

export function HomePage() {
  return (
    <>
      <h1>clip corner</h1>
      <div className='home-container'>
        <div className='home-left'>
          <GroupsSection />
          <ProfileSection />
        </div>
        <div className='home-middle'>
          <GamesSection />
          <div className='search-container'>
            <SearchBar />
            <FilterButton />
          </div>
          <ClipsSection />
        </div>
        <div className='home-right'>
          <UsersSection />
          <UploadSection />
        </div>
      </div>
    </>
  );
}
