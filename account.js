import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const config = window.WRESTLE_NATION_CONFIG;
const notice = document.querySelector('#notice');
const login = document.querySelector('#login');
const profile = document.querySelector('#profile');
const dashboard = document.querySelector('#dashboard');
const show = (element) => { for (const section of [login, profile, dashboard]) section.hidden = section !== element; };
const inform = (message) => { notice.textContent = message; };

if (!config || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl) || !config.supabasePublishableKey || config.supabasePublishableKey.includes('REPLACE_ME')) {
  show(login);
  login.querySelector('button').disabled = true;
  inform('Setup required: create account/config.js using config.example.js.');
} else {
  const supabase = createClient(config.supabaseUrl, config.supabasePublishableKey);
  const redirectTo = new URL('./', window.location.href).href;
  const refresh = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) { show(login); return; }
    const { data, error: profileError } = await supabase.from('profiles').select('display_name,account_kind').eq('user_id', user.id).maybeSingle();
    if (profileError) { inform('Unable to load profile: ' + profileError.message); show(login); return; }
    if (!data) { show(profile); return; }
    document.querySelector('#summary').textContent = `${data.display_name} · ${data.account_kind.replaceAll('_', ' ')} · ${user.email ?? 'Email verified'}`;
    show(dashboard);
  };
  document.querySelector('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button'); button.disabled = true;
    const email = document.querySelector('#email').value.trim();
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: redirectTo } });
      inform(error ? 'Could not send the link. Verify your invitation and try again.' : 'If this email has an invited account, a sign-in link will arrive shortly.');
    } finally { button.disabled = false; }
  });
  document.querySelector('#profile-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!document.querySelector('#adult').checked) return;
    const button = event.currentTarget.querySelector('button'); button.disabled = true;
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Please sign in again.');
      const { error } = await supabase.from('profiles').insert({
        user_id: user.id,
        display_name: document.querySelector('#display-name').value.trim(),
        account_kind: document.querySelector('#account-kind').value,
        country_code: 'US',
        adult_attested_at: new Date().toISOString()
      });
      if (error) throw error;
      inform('Profile saved.'); await refresh();
    } catch (error) { inform('Could not save profile: ' + error.message); }
    finally { button.disabled = false; }
  });
  document.querySelector('#sign-out').addEventListener('click', async () => { await supabase.auth.signOut(); inform('Signed out.'); await refresh(); });
  supabase.auth.onAuthStateChange(() => { setTimeout(refresh, 0); });
  refresh();
}
