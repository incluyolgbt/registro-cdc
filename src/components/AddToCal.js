import './AddToCal.css';

export default function AddToCal() {
  return (
    <span>
      <p className='title'>Agregar a tu calendario</p>
      <p className='button-p'>
        <a
          href='https://www.addevent.com/event/UT16910888+apple'
          title='Apple'
          target='_blank'
          style={{ display: 'inline' }}
          rel='noreferrer'
        >
          <img
            src='https://cdn.addevent.com/libs/imgs/icon-emd-share-apple-t1.png'
            alt='Apple'
            width='45'
            border='0'
            style={{ width: '45px', display: 'inline' }}
          />
        </a>
        <a
          href='https://www.addevent.com/event/UT16910888+google'
          title='Google'
          target='_blank'
          style={{ display: 'inline' }}
          rel='noreferrer'
        >
          <img
            src='https://cdn.addevent.com/libs/imgs/icon-emd-share-google-t1.png'
            alt='Google'
            width='45'
            border='0'
            style={{ width: '45px', display: 'inline' }}
          />
        </a>
        <a
          href='https://www.addevent.com/event/UT16910888+office365'
          title='Office 365'
          target='_blank'
          style={{ display: 'inline' }}
          rel='noreferrer'
        >
          <img
            src='https://cdn.addevent.com/libs/imgs/icon-emd-share-office365-t1.png'
            alt='Office 365'
            width='45'
            border='0'
            style={{ width: '45px', display: 'inline' }}
          />
        </a>
        <a
          href='https://www.addevent.com/event/UT16910888+outlook'
          title='Outlook'
          target='_blank'
          style={{ display: 'inline' }}
          rel='noreferrer'
        >
          <img
            src='https://cdn.addevent.com/libs/imgs/icon-emd-share-outlook-t1.png'
            alt='Outlook'
            width='45'
            border='0'
            style={{ width: '45px', display: 'inline' }}
          />
        </a>
        <a
          href='https://www.addevent.com/event/UT16910888+outlookcom'
          title='Outlook.com'
          target='_blank'
          style={{ display: 'inline' }}
          rel='noreferrer'
        >
          <img
            src='https://cdn.addevent.com/libs/imgs/icon-emd-share-outlookcom-t1.png'
            alt='Outlook.com'
            width='45'
            border='0'
            style={{ width: '45px', display: 'inline' }}
          />
        </a>
      </p>
    </span>
  );
}
