import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/styled/Button';
import { Icon } from '../components/styled/Icon';
import { TextInput } from '../components/styled/TextInput';
import { Avatar } from '../components/styled/Avatar';
import { UserContext } from '../hooks/useUser';
import './SettingsView.css';
import { useFetch } from '../hooks/useFetch';

export function SettingsView() {
  const history = useHistory();
  const userData = React.useContext<any>(UserContext);

  return (
    <div className="settings-view-wrapper">
      <Button type="secondary" onclick={() => history.push('/')}>
        <Icon type="left_arrow" />
        Back home
      </Button>
      <h1>User settings</h1>
      <UserProfileCard userData={userData} />
      <SecurityCard userData={userData} />
    </div>
  );
}

function UserProfileCard(props: { userData: any }) {
  const fileRef = React.useRef<any>(null);
  const [newestUsername, setNewestUsername] = React.useState('');
  const [username, setUsername] = React.useState('');
  React.useEffect(() => {
    if (
      props.userData?.user?.name &&
      props.userData.user.name !== newestUsername
    ) {
      setUsername(props.userData.user.name);
      setNewestUsername(props.userData.user.name);
    }
  }, [newestUsername, props.userData]);

  const updateUserFetch = useFetch({
    url: '/api/v1/users/@me/name',
    method: 'PATCH',
  });

  const deleteAvatar = useFetch({
    url: '/api/v1/users/@me/avatar',
    method: 'DELETE',
  });

  const uploadAvatar = useFetch({
    url: '/api/v1/users/@me/avatar',
    method: 'POST',
  });

  React.useEffect(() => {
    if (updateUserFetch.done) {
      props.userData?.updateUser(updateUserFetch.data.data);
      updateUserFetch.reset();
    }
    if (deleteAvatar.done) {
      props.userData?.updateUser({ avatar: null });
      deleteAvatar.reset();
    }
    if (uploadAvatar.done) {
      // props.userData?.updateUser(); // TODO update avatar data
      uploadAvatar.reset();
    }
  }, [updateUserFetch.done, deleteAvatar.done, uploadAvatar.done]);

  function uploadAvatarImage() {
    if (
      !fileRef.current ||
      !fileRef.current.files ||
      fileRef.current.files.length === 0
    )
      return;
    const form = new FormData();
    form.append('photo', fileRef.current.files[0]);
    uploadAvatar.run(form);
    return;
  }

  return (
    <div className="card">
      <div className="user-profile-columns">
        <Avatar user={props.userData?.user} noStatus />
        <div className="user-profile-expand">
          <div>
            <h2>User profile</h2>
            <label style={{ display: 'inline-block' }}>
              <input
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                ref={fileRef}
                onChange={() => uploadAvatarImage()}
              />
              <Button less_padding margin_right no_button type="secondary">
                Upload avatar
              </Button>
            </label>
            <Button
              less_padding
              margin_right
              type="danger"
              onclick={() => deleteAvatar.run()}
            >
              Remove avatar
            </Button>
            {deleteAvatar.error || uploadAvatar.error ? (
              <p>Something went wrong, try again later</p>
            ) : null}
          </div>
          <div className="user-name">
            <div className="text-wrapper">
              <TextInput
                value={username}
                set={setUsername}
                placeholder="John Doe"
                label="Username"
                noPadding
              />
            </div>
            {updateUserFetch.error &&
            updateUserFetch.error?.data?.code === 'inuse' ? (
              <p>That username is already in use</p>
            ) : updateUserFetch.error &&
              updateUserFetch.error?.res?.status === 400 ? (
              <p>Username must be at least 1 character</p>
            ) : updateUserFetch.error ? (
              <p>Something went wrong, try again later</p>
            ) : null}
            <Button
              less_padding
              loading={updateUserFetch.loading}
              onclick={() => updateUserFetch.run({ username })}
            >
              Save username
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// TODO button functionality and modal
function TwoFaInfo(props: { twoFactor: boolean }) {
  if (!props.twoFactor) {
    return (
      <div className="red">
        <h2>Two Factor Authentication</h2>
        <p>
          <Icon className="twofa-icon" type="alert" />
          Two factor authentication is not enabled!
        </p>
        <Button less_padding margin_right onclick={() => alert('enabled')}>
          Enable 2fa
        </Button>
      </div>
    );
  }
  return (
    <div className="green">
      <h2>Two Factor Authentication</h2>
      <p>
        <Icon className="twofa-icon" type="checkmark" />
        Two factor authentication is enabled!
      </p>
      <Button
        less_padding
        margin_right
        type="danger"
        onclick={() => alert('disabled')}
      >
        Disable 2fa
      </Button>
    </div>
  );
}

function SecurityCard(props: { userData: any }) {
  const deleteUser = useFetch({
    url: '/api/v1/users/@me/',
    method: 'DELETE',
  });

  const logoutAll = useFetch({
    url: '/api/v1/users/@me/sessions',
    method: 'DELETE',
  });

  React.useEffect(() => {
    if (deleteUser.done) window.location.href = '/'; // TODO redirect to home page
  }, [deleteUser.done]);

  return (
    <div className="card">
      <div className="twofa-wrapper">
        <TwoFaInfo twoFactor={props.userData?.user?.twofactor} />
      </div>
      <div className="dangerZone-wrapper">
        <h2>Danger Zone</h2>
        <p>
          Watch out, these actions can permanently affect your account. Use with
          caution!
        </p>
        <Button
          less_padding
          margin_right
          type="danger"
          loading={deleteUser.loading}
          onclick={() => deleteUser.run()}
        >
          Delete account
        </Button>
        <Button
          less_padding
          margin_right
          type="secondary"
          loading={logoutAll.loading}
          onclick={() => logoutAll.run()}
        >
          Logout all devices
        </Button>
        {deleteUser.error || logoutAll.error ? (
          <p>Something went wrong, try again later</p>
        ) : null}
        {logoutAll.done ? <p>Logged out all devices!</p> : null}
      </div>
    </div>
  );
}
