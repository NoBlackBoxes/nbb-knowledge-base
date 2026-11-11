---
title: Atomic Structure - Electrons, Orbitals, Shells and the Periodic Table
tags:
- technical
- physics
- chemistry
- reference
---

# Atomic Structure — Electrons, Orbitals, Shells and the Periodic Table

## What holds an atom together?

Atoms are held together by **electromagnetic attraction between the positively charged nucleus and negatively charged electrons**.

- Protons (+) attract electrons (−).
   
- Electrons repel other electrons.
   
- Protons repel other protons.
   
- The nucleus itself is held together primarily by the **strong nuclear interaction**, which overcomes proton–proton electrical repulsion at nuclear distances.
   

Quantum mechanics does **not** replace electromagnetic attraction. Electromagnetism provides the attractive interaction; quantum mechanics determines what electron configurations are possible.

> **Electromagnetism provides the attraction; quantum mechanics determines the resulting atomic structure.**

---

## Electrons are not little orbiting dots

The planetary model of electrons orbiting a nucleus is useful historically but fundamentally misleading.

An electron is a **quantum object**. In an atom it is described by a **wavefunction**, and an orbital can be thought of approximately as an allowed standing-wave pattern around the nucleus.

An orbital therefore does not describe a trajectory. It describes a quantum state and the spatial probability distribution associated with finding the electron.

Only particular wave patterns/energy states are allowed. This quantization produces the structure we describe as **shells, subshells and orbitals**.

---

## Why don't electrons collapse into the nucleus?

The nucleus electrically attracts electrons, so classically one might expect them to collapse inward.

Quantum mechanics prevents this.

The Heisenberg uncertainty relation is

$$
\Delta x\,\Delta p \geq \frac{\hbar}{2}
$$

If an electron were confined to an extremely small region around the nucleus, its position uncertainty would become very small. Its momentum uncertainty—and therefore its characteristic kinetic energy—would become very large.

The stable atomic state therefore represents a balance between:

- electromagnetic attraction pulling the electron inward;
   
- quantum kinetic energy making extreme confinement energetically costly.
   

For multi-electron atoms, the **Pauli exclusion principle** additionally prevents all electrons from occupying the same lowest-energy quantum state.

---

## The Pauli exclusion principle — what does it actually mean?

Saying *"electrons cannot share a state because of the Pauli exclusion principle"* merely names the rule.

The deeper reason is that electrons are **fermions**. The quantum state of identical fermions is antisymmetric when two particles are exchanged:

$$
\psi(1,2)=-\psi(2,1)
$$

If two electrons had exactly the same quantum state, exchanging them would make no physical difference, yet antisymmetry requires the wavefunction to change sign. The only possible result is then

$$
\psi=-\psi \Rightarrow \psi=0
$$

so that configuration has zero probability.

This connection between half-integer-spin particles and fermionic behaviour is formalised by the **spin-statistics theorem** in relativistic quantum field theory.

Why nature ultimately has these particular quantum laws is a deeper question for which physics currently has no further established mechanistic answer.

---

# The four quantum numbers

An electron state in an atom is specified by four quantum numbers:

| Quantum number | Meaning                      | Rough structural interpretation |
| -------------- | ---------------------------- | ------------------------------- |
| $n$            | Principal                    | Shell                           |
| $l$            | Angular momentum / azimuthal | Subshell                        |
| $m_l$          | Magnetic                     | Orbital within the subshell     |
| $m_s$          | Spin                         | One of two spin states          |

Therefore the useful hierarchy is:

**shell → subshell → orbital → spin**

No two electrons in an atom can have all four quantum numbers identical.

Consequently, a single orbital can contain **two electrons**: they have identical $n$, $l$, and $m_l$, but opposite $m_s$.

---

## How shells contain subshells and orbitals

The hierarchy **shell → subshell → orbital** is literal in the sense that each level determines which states can exist at the next level.

- Every **shell** contains one or more allowed subshells.
   
- Every **subshell** contains one or more orbitals.
   
- Every **orbital** can contain at most two electrons, which must have opposite spins.
   

| Shell | Allowed subshells | Number of orbitals | Maximum electrons (# orbitals x 2) |
| ----- | ----------------- | ------------------ | ---------------------------------- |
| $n=1$ | 1s                | 1                  | 2                                  |
| $n=2$ | 2s, 2p            | 1 + 3 = 4          | 8                                  |
| $n=3$ | 3s, 3p, 3d        | 1 + 3 + 5 = 9      | 18                                 |
| $n=4$ | 4s, 4p, 4d, 4f    | 1 + 3 + 5 + 7 = 16 | 32                                 |

**Helium makes this particularly clear.**

Helium has the configuration:

$1s^2$

Both electrons are in the **same 1s orbital**, with opposite spins.

The first shell cannot contain another orbital or another subshell: for $n=1$, the only allowed subshell is **1s**, and an s subshell contains only **one orbital**. That orbital is now full.

Therefore, when a third electron is added to make lithium, **there is simply no allowed state left in the first shell**. The electron must enter the next shell:

$\mathrm{Li}: 1s^2\,2s^1$

This is the concrete meaning of electrons “filling shells”: they occupy the lowest-energy allowed quantum states until all states available at that level are occupied, after which they must occupy another allowed state.

---

# How electrons fill states

Electrons occupy the **lowest-energy available quantum states**.

For the smallest atoms the logic is particularly easy to see:

- **H:** first electron occupies $1s$.
   
- **He:** second electron can occupy the same $1s$ orbital by having opposite spin.
   
- **Li:** $1s$ is full, so the next electron occupies $2s$.
   
- **Be:** second electron fills $2s$.
   
- **B:** $2s$ is full, so the next electron enters $2p$.
   
- **C and N:** electrons occupy different available p orbitals before pairing.
   
- **O, F, Ne:** those p orbitals progressively become paired.
   

A useful conceptual sequence is therefore:

**change spin → change orbital → change subshell → change shell**

—but only insofar as this corresponds to the **lowest-energy available state**.

For larger atoms, that simple sequence becomes less obvious because subshell energies overlap.

---

# Shells, periods and the periodic table

The **periods (rows)** of the periodic table correspond approximately to principal electron shells.

Thus moving into a new period means beginning occupation associated with a new principal shell.

### Period length is not the total number of electrons

The number of positions in a period tells us **how many electrons are added while moving across that period**, not how many electrons those atoms contain in total.

Electron number is **cumulative across periods**. For example:

- Period 1 adds 2 electrons → helium has 2.
- Period 2 adds another 8 → neon has 2+8 = 10.
- Period 3 adds another 8 → argon has 2+8+8=18
- Period 4 adds another 18 → krypton has 36.
    

For a neutral atom, moving one position to the right adds **one proton and one electron**, so atomic number increases by one.

In the fully expanded periodic table, periods have lengths **2, 8, 8, 18, 18, 32, 32**. The long periods arise because subshells from different principal shells overlap in energy; for example, period 4 fills **4s**, then **3d**, then **4p**, giving **2 + 10 + 6 = 18 positions**.

However, shells contain subshells, and **subshells belonging to different principal shells can overlap in energy**.

This is crucial.

Energy is not determined by $n$ alone. Orbital shape, nuclear attraction, shielding and electron–electron interactions all affect the energy.

For example, $4s$ initially lies below $3d$, so it fills first. Once the 3d subshell becomes occupied, the relative energies change and 3d becomes lower than 4s. Consequently transition metals generally lose their 4s electrons before their 3d electrons.

So:

> **Periods roughly represent shells; much of the complexity of larger atoms comes from overlapping subshell energies.**

As atomic number increases, there are more electrons, more electron–electron interactions and more shielding, so the energetic ordering becomes increasingly complicated.

---

# Why the periodic-table columns relate to valence electrons

For the **s and p blocks**, the group structure maps particularly cleanly onto the number of outer-shell electrons.

### s block

- Group 1 → $ns^1$
   
- Group 2 → $ns^2$
   

### p block

The p subshell can hold six electrons. Together with the two s electrons, the outer shell can contain up to eight:

$ns^2np^6$

This produces the familiar main-group relationship between position in the periodic table and number of valence electrons.

---

# Transition metals: the rule becomes broader, not meaningless

For transition metals, "valence electrons" cannot simply mean **electrons in the outermost principal shell**.

The outer $ns$ and nearby $(n-1)d$ subshells have similar energies, so electrons from both can participate in chemistry.

For example:

### Chromium — group 6

$[\mathrm{Ar}]\,3d^5 4s^1$

Total potentially chemically active $s+d$ electrons ≈ **6**.

### Manganese — group 7

$[\mathrm{Ar}]\,3d^5 4s^2$

Total ≈ **7**.

### Niobium — group 5

$[\mathrm{Kr}]\,4d^4 5s^1$

Total ≈ **5**.

So the group number still reflects an important underlying electron-counting pattern. It simply no longer means *"number of electrons in the outermost shell."*

A better interpretation for transition metals is approximately:

> **Group number reflects the combined $s+d$ valence-electron count that can potentially participate in chemistry.**

Not all of these electrons necessarily participate in every reaction, which is why transition metals have multiple oxidation states.

---

## Iron as an example

Iron is

$[\mathrm{Ar}]\,3d^6 4s^2$

and belongs to **group 8**.

Its two 4s electrons are outermost, but its six 3d electrons are energetically close enough to participate in chemistry.

Common oxidation states illustrate this:

- Fe²⁺: primarily loss of the two 4s electrons.
   
- Fe³⁺: loss of the two 4s electrons plus one 3d electron.
   

Thus transition-metal oxidation states arise partly because different nearby subshells can contribute electrons.

---

## Copper and zinc

Late transition metals become somewhat cleaner again.

Copper:

$[\mathrm{Ar}]\,3d^{10}4s^1$

Zinc:

$[\mathrm{Ar}]\,3d^{10}4s^2$

Their filled $3d^{10}$ subshell is relatively stable, so the outer s electrons become especially important. This makes groups 11 and 12 look more like the simple main-group pattern again, although transition-metal chemistry still has important exceptions.

---

# The f block

The same basic principles continue into the lanthanides and actinides, but the energetic situation becomes even more complicated.

Here the relevant states include:

- outer s orbitals,
   
- nearby d orbitals,
   
- partially filled 4f or 5f orbitals.
   

These subshells can be relatively close in energy, and their participation in bonding varies.

This helps explain why:

- lanthanides have very similar chemistry to one another;
   
- multiple oxidation states occur;
   
- magnetic behaviour can be unusual;
   
- actinide chemistry is especially complicated.
   

Again, this is not a breakdown of quantum structure. It is the consequence of **several allowed quantum states having similar energies**.

---

# Overall picture

The useful mental model is:

1. **Electromagnetic attraction** binds negatively charged electrons to the positively charged nucleus.
2. Electrons are **quantum objects**, not classical orbiting particles.
3. Their wavefunctions can occupy only particular **quantized states**.
4. These states form the hierarchy
    **shell → subshell → orbital → spin**.
5. The Pauli principle prevents two electrons from having the same complete set of four quantum numbers.
6. Electrons therefore progressively occupy additional states as atomic number increases.
7. For small atoms, the energetic ordering is relatively straightforward.
8. In larger atoms, subshells from different shells become similar in energy and **overlap energetically**.
9. This produces transition-metal and f-block complexity.
10. The periodic table is essentially a visible map of this progressive filling of quantum electron states.

### The central conceptual distinction

**The nucleus does not create shells because its electrical attraction becomes too weak to keep all the electrons together.**

Instead, electromagnetic attraction provides the potential that binds electrons, while **quantum mechanics restricts the electron field/wavefunctions to particular states**. As electrons are added, the lowest available states fill and additional electrons must occupy other allowed states.

The periodic table is the macroscopic chemical fingerprint of that quantum structure.
