/* eslint-disable testing-library/no-node-access */
import { render, screen } from '@testing-library/react';
import PremiseCardV2 from './PremiseCardV2';


const mockPremise = {
  id: '123',
  dText: 'Test content',
  stylings: '',
  bg_img: '',
  bg_color: '#ffffff',
  project_id: 'project123',
  stamp: 'Published',
  centraldatabase: {
    profile_photo: '',
    type: 'standard',
    user_type: 'basic'
  },
  first_name: 'Arif',
  last_name: 'Ikhtiaj',
};

const defaultProps = {
  p: mockPremise,
  user: '123',
  owner: '123',
  is_draft: false,
  isLiked: false,
  comments: [],
  likes: [],
  bg_img: '',
  bg_color: '#fafafa',
  currentProjectName: 'My Awesome Project',
  formattedDate: 'July 25, 2025',
  formattedTime: '3:00 PM',
  premiseOwner: mockPremise,
  viewText: 'Sample view text',
  stylings: '',
  project_id: 'project123',
  index: 0,
  // Add empty functions or mock fns for all the setters and handlers used
  setOpenCharacterChart: jest.fn(),
  setOpenDotMenu: jest.fn(),
  setOpenHidePop: jest.fn(),
  setAddPopup: jest.fn(),
  setNotifyPopup: jest.fn(),
  setUserMail: jest.fn(),
  setSaleId: jest.fn(),
  setViewSale: jest.fn(),
  setSaleRequestPop: jest.fn(),
  setTranslationRequestPop: jest.fn(),
  setOpenTransOtherPop: jest.fn(),
  setOpenAvailableForTranslationPop: jest.fn(),
  setOpenViewTranslationsPop: jest.fn(),
  setOpenMonetizingPreferencesPop: jest.fn(),
  setNoAccessLbPopUp: jest.fn(),
  setOwnerMail: jest.fn(),
  setIsLiked: jest.fn(),
  refetch: jest.fn(),
  handleCheckPremiseData: jest.fn(),
  handleVisibility: jest.fn(),
  handleMonetizing: jest.fn(),
  handleUserMail: jest.fn(),
  handleHideUnhidePremise: jest.fn(),
  addPopup: false,
  notifyPopup: false,
  openPop: false,
  openDotMenu: false,
  openHidePop: false,
  dotPopupRef: null,
};

describe('PremiseCard', () => {
  test('renders without crashing', () => {
    render(<PremiseCardV2 {...defaultProps} />);
    expect(screen.getByText(/Arif Ikhtiaj/i)).toBeInTheDocument();
  });

  test('displays project name when owner', () => {
    render(<PremiseCardV2 {...defaultProps} />);
    expect(screen.getByText(/My Awesome Project/i)).toBeInTheDocument();
  });

  test('shows draft badge if is_draft is true', () => {
    render(<PremiseCardV2 {...defaultProps} is_draft={true} />);
    expect(screen.getByText(/Draft/i)).toBeInTheDocument();
  });

  test('renders background color when no image', () => {
    render(<PremiseCardV2 {...defaultProps} />);
    const bgDiv = screen.getByText(/Sample view text/i).parentElement?.parentElement;
    expect(bgDiv).toHaveStyle({ backgroundColor: '#fafafa' });
  });
});
