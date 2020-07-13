<script>
import { send } from "shared/actions.js";
</script>

<div class="card">
    <h1>Home</h1>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis in amet dolor labore eius corrupti alias earum tenetur odio expedita. Sed, natus. Eveniet atque est, qui provident impedit sapiente voluptates!</p>
    <div class="nav">
        <button use:send="{"AUTH"}" >Sign Out</button>
    </div>
</div>
