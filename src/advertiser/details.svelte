svelte
<script>
    import { onMount } from 'svelte';

    let advDefField = 'company';
    let canAddTags = [];
    let country = 'XX';
    let assignedManagers = {};
    let managersList = [];
    let publisher = {};
    let org = { hasFeature : (feature)=>{return true} };
    let user = { isAdmin: ()=> {return true},type:"admin"};
    let errors = {};
    let form = {};

    // Dummy functions
    const t = (key) => key; // Placeholder translation function
    const message = (msg) => console.log(msg); // Placeholder message function
    const errorsFunc = (errors, fieldName) => console.error('Error:', errors, 'Field:', fieldName); // Placeholder error function
    const admin = { verifyEmail: (email, email_msg, publisher) => { } };
    const json_encode = (data) => JSON.stringify(data);


    onMount(() => {
        //   $(document).ready(function() {
        //     //Initialize select2 inputs
        //     var $assignedManager = $('#assigned_manager');
        //     $assignedManager.select2({
        //       maximumSelectionSize: 5,
        //       placeholder: 'Select Manager',
        //     });

        //     $assignedManager.on('change', function() {
        //       var assigned = $(this).select2('val');
        //       $('#assigned_manager_input').val(JSON.stringify(assigned));
        //     });
        //   });

    });

</script>

<div class="row">
    <div class="col-sm-12">
        <div class="form-group">
            <label for="org">{t('advertiser.org')}</label>
            <select name="org" id="org" class="form-control">
                {#each Object.keys(org.options || {}) as optionKey}
                    <option value={optionKey} selected={org.id == optionKey} >{org.options[optionKey]}</option>
                {/each}
            </select>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-sm-6">
        <div class="form-group">
            <label for="status">{t('status')}</label>
            <select id="status" name="status" class="form-control" value={publisher.status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
        </div>
    </div>
    <div class="col-sm-6">
        <div class="form-group">
            <label for="username">{t('username')}</label>
            <input type="text" class="form-control" id="username" name="username"
                value={publisher.username} placeholder={t('username')} />
            <span class="help-block text-danger">{/* {echo Shared\Markup::errors($errors, "username")} */}</span>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-sm-6">
        <div class="form-group">
            <label for="email">{t('email')}</label>
            <input type="email" class="form-control" id="email" name="email" value={publisher.email}
                placeholder={t('email')} />
            <span class="help-block text-danger">{/* {echo Shared\Markup::errors($errors, "email")} */}</span>
        </div>
    </div>

    {#if org.hasFeature("advertiser_manager")}
        <div class="col-sm-6">
            <div class="form-group">
                <label for="assigned_manager">{t('assigned_manager')}</label>
                <select name="assigned_manager" id="assigned_manager" multiple="multiple" class="form-control">
                    {#each Object.keys(assignedManagers) as managerKey}
                         {#if managerKey}
                            <option value={managerKey} >{assignedManagers[managerKey]}</option>
                        {/if}
                    {/each}
                </select>
                <input type="hidden" id="assigned_manager_input" name="assigned_manager"
                    value={JSON.stringify(Object.keys(assignedManagers))} />
            </div>
        </div>
    {/if}
</div>
<div class="row">
    <div class="col-sm-12">
        <div class="form-group">
            <label for="notes">{t('notes')}</label>
            <textarea class="form-control" id="notes" name="notes" rows="5">{publisher.notes}</textarea>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-sm-12">
        <div class="form-group">
            <label for="description">{t('description')}</label>
            <textarea class="form-control" id="description" name="description" rows="5">{publisher.description}</textarea>
        </div>
    </div>
</div>
